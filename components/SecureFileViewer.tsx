'use client';

import React, { useEffect, useState } from 'react';
import { X, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface SecureFileViewerProps {
  materialId: number;
  fileName: string;
  onClose: () => void;
}

export default function SecureFileViewer({
  materialId,
  fileName,
  onClose
}: SecureFileViewerProps) {
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch secure viewing token and URL
  useEffect(() => {
    const fetchSecureUrl = async () => {
      try {
        setLoading(true);
        
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        
        // Get viewing token
        const tokenResponse = await fetch(`${API_BASE_URL}/materials/${materialId}/token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.message || 'Failed to get viewing token');
        }

        const { token } = await tokenResponse.json();

        // Get secure URL
        const urlResponse = await fetch(`${API_BASE_URL}/materials/secure/${token}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!urlResponse.ok) {
          const errorData = await urlResponse.json();
          throw new Error(errorData.message || 'Failed to get secure URL');
        }

        const { secureUrl: url } = await urlResponse.json();
        console.log('Secure URL received:', url);
        setSecureUrl(url);
      } catch (err) {
        console.error('Error fetching secure URL:', err);
        setError(err instanceof Error ? err.message : 'Failed to load secure content');
      } finally {
        setLoading(false);
      }
    };

    fetchSecureUrl();
  }, [materialId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (secureUrl) {
        // Revoke object URL if it was created
        try {
          URL.revokeObjectURL(secureUrl);
        } catch (e) {
          // Ignore errors for external URLs
        }
      }
    };
  }, [secureUrl]);

  const handleClose = () => {
    setSecureUrl(null);
    onClose();
  };

  const handleOpenInNewTab = () => {
    if (secureUrl) {
      window.open(secureUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-[#1E88E5] animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">Loading Material</h3>
          <p className="text-gray-600 text-center">
            Preparing secure access to the course material...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">Access Denied</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
      {/* Header Bar */}
      <div className="bg-[#1E88E5] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5" />
          <div>
            <span className="font-medium">{fileName}</span>
            <p className="text-xs text-green-100">Course Material</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleOpenInNewTab}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700"
          >
            Open in New Tab
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-gray-100">
        {secureUrl && (
          <iframe
            src={secureUrl}
            className="w-full h-full border-0"
            title={fileName}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="fullscreen"
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-green-400" />
          <span className="text-sm">Secure viewing session</span>
        </div>
        <div className="text-xs text-gray-400">
          Course material provided by admin
        </div>
      </div>
    </div>
  );
}
