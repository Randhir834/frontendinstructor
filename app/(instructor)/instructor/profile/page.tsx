'use client';

import { useState, useEffect } from 'react';
import {
  Mail, Phone, MapPin, Calendar,
  Camera, Loader2, Save,
  GraduationCap, Trash2, Target, Award
} from 'lucide-react';
import { userService, UserProfile } from '@/services/userService';
import { getAvatarUrl } from '@/utils/avatarUtils';

export default function InstructorProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    qualifications: '',
    specialization: '',
    bio: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await userService.getProfile();
        
        setUser(profile);
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          location: profile.location || '',
          qualifications: profile.qualifications || '',
          specialization: profile.specialization || '',
          bio: profile.bio || ''
        });
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setMessage('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      setMessage('Name is required.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        location: formData.location.trim() || undefined,
        qualifications: formData.qualifications.trim() || undefined,
        specialization: formData.specialization.trim() || undefined,
        bio: formData.bio.trim() || undefined
      });
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        phone: updatedUser.phone || '',
        location: updatedUser.location || '',
        qualifications: updatedUser.qualifications || '',
        specialization: updatedUser.specialization || '',
        bio: updatedUser.bio || ''
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Failed to update profile.';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await userService.uploadProfilePhoto(file);
      setUser(result.user);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
          detail: { user: result.user } 
        }));
      }
      
      setMessage('Profile photo updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Failed to upload profile photo.';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async () => {
    if (!user?.avatar_url) return;
    
    setUploadingPhoto(true);
    try {
      const result = await userService.deleteProfilePhoto();
      setUser(result.user);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
          detail: { user: result.user } 
        }));
      }
      
      setMessage('Profile photo removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Failed to remove profile photo.';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#78909C]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || 'Instructor';
  const role = user?.role || 'instructor';
  const email = user?.email || '';
  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }) 
    : 'N/A';

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('successfully') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'} animate-in fade-in slide-in-from-top-4 shadow-sm`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#E3F2FD] shadow-md">
                <img 
                  src={getAvatarUrl(user?.avatar_url, displayName)} 
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
                id="photo-upload"
              />
              <button 
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#1E88E5] border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-[#1565C0] shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload photo"
              >
                {uploadingPhoto ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </button>
              {user?.avatar_url && (
                <button
                  onClick={handleDeletePhoto}
                  disabled={uploadingPhoto}
                  className="absolute top-0 right-0 w-8 h-8 bg-[#EC407A] border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-[#D81B60] shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove photo"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={saving}
                    className="text-2xl md:text-3xl font-bold text-[#1E3A5F] bg-transparent border-b-2 border-transparent hover:border-[#E0E0E0] focus:border-[#1E88E5] focus:outline-none px-2 py-1 w-full md:w-auto text-center md:text-left transition-colors disabled:cursor-not-allowed"
                    placeholder="Your Name"
                  />
                  <span className="px-3 py-1 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white text-xs font-semibold rounded-full capitalize shadow-sm">
                    {role}
                  </span>
                </div>
                {formData.name !== user?.name && (
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={saving || !formData.name.trim()}
                    className="w-full md:w-auto px-6 py-2.5 bg-[#1E88E5] text-white text-sm font-medium rounded-lg hover:bg-[#1565C0] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={18} className="text-[#1E88E5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#78909C] mb-0.5">Email Address</p>
                    <p className="text-sm font-semibold text-[#1E3A5F] truncate">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar size={18} className="text-[#1E88E5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#78909C] mb-0.5">Member Since</p>
                    <p className="text-sm font-semibold text-[#1E3A5F] truncate">{joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Me / Bio Section */}
        {formData.bio && (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-4">About Me</h3>
            <p className="text-[#546E7A] leading-relaxed">{formData.bio}</p>
          </div>
        )}

        {/* Professional Information */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1E3A5F]">Professional Information</h3>
            {isEditingProfessional ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      qualifications: user?.qualifications || '',
                      specialization: user?.specialization || '',
                      bio: user?.bio || ''
                    });
                    setIsEditingProfessional(false);
                  }}
                  disabled={saving}
                  className="text-xs text-[#78909C] hover:text-[#1E3A5F] font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleUpdateProfile();
                    setIsEditingProfessional(false);
                  }}
                  disabled={saving}
                  className="text-xs text-[#1E88E5] hover:text-[#1565C0] font-semibold flex items-center gap-1 transition-colors disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingProfessional(true)}
                className="text-xs text-[#1E88E5] font-semibold hover:underline transition-all"
              >
                Edit
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-[#FAFAFA] rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1E88E5] shrink-0 shadow-sm">
                <GraduationCap size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#78909C] mb-1">Qualifications</p>
                {isEditingProfessional ? (
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    disabled={saving}
                    placeholder="e.g., M.Sc. in Computer Science"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E0E0E0] text-[#1E3A5F] focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all disabled:cursor-not-allowed"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#1E3A5F]">{formData.qualifications || 'Not provided'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-[#FAFAFA] rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1E88E5] shrink-0 shadow-sm">
                <Target size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#78909C] mb-1">Specialization</p>
                {isEditingProfessional ? (
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    disabled={saving}
                    placeholder="e.g., Web Development, Data Science"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E0E0E0] text-[#1E3A5F] focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all disabled:cursor-not-allowed"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#1E3A5F]">{formData.specialization || 'Not provided'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-[#FAFAFA] rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1E88E5] shrink-0 shadow-sm">
                <Award size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#78909C] mb-1">Bio</p>
                {isEditingProfessional ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={saving}
                    placeholder="Tell students about yourself, your teaching philosophy, and experience..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E0E0E0] text-[#1E3A5F] focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all resize-none disabled:cursor-not-allowed"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#1E3A5F]">{formData.bio || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1E3A5F]">Contact Information</h3>
            {isEditingContact ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      phone: user?.phone || '',
                      location: user?.location || ''
                    });
                    setIsEditingContact(false);
                  }}
                  disabled={saving}
                  className="text-xs text-[#78909C] hover:text-[#1E3A5F] font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleUpdateProfile();
                    setIsEditingContact(false);
                  }}
                  disabled={saving}
                  className="text-xs text-[#1E88E5] hover:text-[#1565C0] font-semibold flex items-center gap-1 transition-colors disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingContact(true)}
                className="text-xs text-[#1E88E5] font-semibold hover:underline transition-all"
              >
                Edit
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-[#FAFAFA] rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1E88E5] shrink-0 shadow-sm">
                <Phone size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#78909C] mb-1">Phone Number</p>
                {isEditingContact ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={saving}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E0E0E0] text-[#1E3A5F] focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all disabled:cursor-not-allowed"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#1E3A5F]">{formData.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-[#FAFAFA] rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1E88E5] shrink-0 shadow-sm">
                <MapPin size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#78909C] mb-1">Location</p>
                {isEditingContact ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={saving}
                    placeholder="Enter your location"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E0E0E0] text-[#1E3A5F] focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all disabled:cursor-not-allowed"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#1E3A5F] truncate">{formData.location || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
