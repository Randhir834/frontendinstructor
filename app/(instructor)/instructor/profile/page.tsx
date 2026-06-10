'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail, Phone, MapPin, Calendar, BookOpen, Video,
  Camera, Bell, Shield, Settings, LogOut, Loader2, Trash2, Save,
  GraduationCap, Users, ChevronRight
} from 'lucide-react';
import { userService, UserProfile } from '@/services/userService';
import { instructorDashboardService, InstructorDashboardData } from '@/services/instructorDashboardService';
import { getAvatarUrl } from '@/utils/avatarUtils';

export default function InstructorProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleLogout = () => {
    userService.logout();
  };

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    qualifications: 'N/A',
    specialization: 'N/A',
    phone: 'N/A',
    location: 'N/A'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, dashData] = await Promise.all([
          userService.getProfile(),
          instructorDashboardService.getDashboardData()
        ]);
        setUser(profile);
        setDashboardData(dashData);
        setFormData(prev => ({
          ...prev,
          name: profile.name,
          qualifications: profile.qualifications || 'N/A',
          specialization: profile.specialization || 'N/A',
          phone: profile.phone || 'N/A',
          location: profile.location || 'N/A'
        }));
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        name: formData.name,
        qualifications: formData.qualifications === 'N/A' ? undefined : formData.qualifications,
        specialization: formData.specialization === 'N/A' ? undefined : formData.specialization,
        phone: formData.phone === 'N/A' ? undefined : formData.phone,
        location: formData.location === 'N/A' ? undefined : formData.location
      });
      setUser(updatedUser);
      setFormData(prev => ({
        ...prev,
        name: updatedUser.name,
        qualifications: updatedUser.qualifications || 'N/A',
        specialization: updatedUser.specialization || 'N/A',
        phone: updatedUser.phone || 'N/A',
        location: updatedUser.location || 'N/A'
      }));
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile.');
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
    } catch (err) {
      setMessage('Failed to upload profile photo.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingPhoto(false);
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
    } catch (err) {
      setMessage('Failed to remove profile photo.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#64748B]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || 'Instructor';
  const role = user?.role || 'instructor';
  const email = user?.email || '';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

  const stats = [
    { label: 'Live Classes', value: dashboardData?.stats.liveClassesConducted || 0, icon: Video, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
    { label: 'Total Students', value: dashboardData?.stats.totalStudents || 0, icon: Users, color: 'text-[#2563EB]', bg: 'bg-[#DBEAFE]' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('successfully') ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#FEE2E2] text-[#DC2626]'} animate-in fade-in slide-in-from-top-4`}>
          {message}
        </div>
      )}

        <div className="space-y-4 md:space-y-6">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#F0FDF4]">
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
                  className="absolute bottom-1 right-1 w-8 h-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#1E88E5] shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>
                {user?.avatar_url && (
                  <button
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 border border-white rounded-full flex items-center justify-center text-white hover:bg-red-600 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-xl md:text-2xl font-bold text-[#1E293B] bg-transparent border-none focus:ring-0 p-0 w-full md:w-auto text-center md:text-left"
                    />
                    <span className="px-3 py-0.5 bg-[#DBEAFE] text-[#1E88E5] text-xs font-semibold rounded-md capitalize">
                      {role}
                    </span>
                  </div>
                  {formData.name !== user?.name && (
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="w-full md:w-auto px-4 py-2 bg-[#1E88E5] text-white text-sm font-medium rounded-lg hover:bg-[#1976D2] transition-colors flex items-center justify-center gap-2"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-x-12">
                  <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                    <div className="flex items-center gap-2 w-28 sm:w-32">
                      <Calendar size={16} className="text-[#94A3B8] shrink-0" />
                      <span className="text-sm text-[#64748B]">Member Since</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">{joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                    <div className="flex items-center gap-2 w-28 sm:w-32">
                      <Mail size={16} className="text-[#94A3B8] shrink-0" />
                      <span className="text-sm text-[#64748B]">Email</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E293B] truncate max-w-[120px] sm:max-w-[150px]">{email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Layout below Header */}
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Left Column: Stats & Contact info */}
            <div className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
              {/* Stats Grid */}
              {stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 md:p-5">
                      <div className="flex items-center gap-3 md:gap-4 mb-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 ${stat.bg} rounded-full flex items-center justify-center`}>
                          <stat.icon size={16} className={stat.color} />
                        </div>
                        <span className="text-lg md:text-xl font-bold text-[#1E293B]">{stat.value}</span>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#64748B]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1E293B]">Contact Information</h3>
                  <button className="text-[11px] text-[#1E88E5] font-bold">Edit</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8] shrink-0">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm text-[#64748B]">{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8] shrink-0">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm text-[#64748B] line-clamp-1">{formData.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8] shrink-0">
                      <GraduationCap size={16} />
                    </div>
                    <span className="text-sm text-[#64748B]">{formData.qualifications}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8] shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-sm text-[#64748B]">{formData.specialization}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Account Settings */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6 h-full flex flex-col">
                <h3 className="font-bold text-[#1E293B] mb-5">Account Settings</h3>
                <div className="space-y-2 flex-1">
                  {[
                    { label: 'Notification Preferences', icon: Bell, path: undefined as string | undefined },
                    { label: 'Privacy Settings', icon: Settings, path: undefined as string | undefined },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => item.path && router.push(item.path)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#F8FAFC] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="text-[#94A3B8] group-hover:text-[#1E88E5]" />
                        <span className="text-sm text-[#64748B] font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-[#CBD5E1]" />
                    </button>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#FEF2F2] rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={18} className="text-[#DC2626] opacity-80" />
                      <span className="text-sm text-[#DC2626] font-semibold">Logout</span>
                    </div>
                    <ChevronRight size={16} className="text-[#DC2626] opacity-50" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 hover:bg-[#FFF5F5] rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <Trash2 size={18} className="text-[#DC2626] opacity-50" />
                      <span className="text-sm text-[#DC2626] font-medium">Deactivate Account</span>
                    </div>
                    <ChevronRight size={16} className="text-[#DC2626] opacity-30" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
