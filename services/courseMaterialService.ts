import api from './api';

export interface CourseMaterial {
  id: number;
  title: string;
  description: string;
  file_type: 'pdf' | 'ppt' | 'image' | 'document';
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by_name: string;
  created_at: string;
}

class CourseMaterialService {
  /**
   * Get all materials for a course (instructor view - read only)
   */
  async getCourseMaterials(courseId: number): Promise<{ materials: CourseMaterial[] }> {
    const response = await api.get(`/courses/${courseId}/materials`);
    return response.data;
  }

  /**
   * Generate a secure viewing token for a material
   */
  async getViewingToken(materialId: number): Promise<{ token: string; expiresAt: string }> {
    const response = await api.post(`/materials/${materialId}/token`);
    return response.data;
  }

  /**
   * Get secure URL for viewing material
   */
  async getSecureUrl(token: string): Promise<{ 
    secureUrl: string; 
    fileName: string; 
    mimeType: string 
  }> {
    const response = await api.get(`/materials/secure/${token}`);
    return response.data;
  }

  /**
   * Get file type from MIME type
   */
  getFileType(mimeType: string): 'pdf' | 'ppt' | 'image' | 'document' {
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'ppt';
    if (mimeType.startsWith('image/')) return 'image';
    return 'document';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get file icon based on file type
   */
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'ppt':
        return '📊';
      case 'image':
        return '🖼️';
      case 'document':
        return '📝';
      default:
        return '📁';
    }
  }
}

export const courseMaterialService = new CourseMaterialService();