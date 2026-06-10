'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Presentation, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import SecureFileViewer from '@/components/SecureFileViewer';
import { courseMaterialService, CourseMaterial } from '@/services/courseMaterialService';

interface CourseMaterialsManagerProps {
  courseId: number;
  courseName: string;
}

export default function CourseMaterialsManager({ 
  courseId, 
  courseName
}: CourseMaterialsManagerProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMaterial, setViewingMaterial] = useState<CourseMaterial | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch course materials
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await courseMaterialService.getCourseMaterials(courseId);
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  // Handle security violations
  const handleSecurityViolation = async (type: 'screenshot' | 'download') => {
    if (!viewingMaterial) return;

    try {
      if (type === 'screenshot') {
        await courseMaterialService.reportScreenshotAttempt(viewingMaterial.id);
      } else {
        await courseMaterialService.reportDownloadAttempt(viewingMaterial.id);
      }
    } catch (err) {
      console.error('Failed to report security violation:', err);
    }
  };

  // Get file type icon
  const getFileIcon = (fileType: string, mimeType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'ppt':
        return <Presentation className="h-6 w-6 text-orange-600" />;
      case 'image':
        return <Image className="h-6 w-6 text-green-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    return courseMaterialService.formatFileSize(bytes);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return courseMaterialService.formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Materials</h2>
          <p className="text-gray-600">{courseName}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No materials uploaded yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Course materials will appear here once uploaded by the administrator
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getFileIcon(material.file_type, material.mime_type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {material.title}
                        </h4>
                        {material.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {material.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{material.file_name}</span>
                          <span>{formatFileSize(material.file_size)}</span>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{material.uploaded_by_name}</span>
                          </div>
                          <span>{formatDate(material.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        onClick={() => setViewingMaterial(material)}
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secure File Viewer */}
      {viewingMaterial && (
        <SecureFileViewer
          materialId={viewingMaterial.id}
          fileName={viewingMaterial.file_name}
          onClose={() => setViewingMaterial(null)}
          onSecurityViolation={handleSecurityViolation}
        />
      )}
    </div>
  );
}
