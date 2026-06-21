'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { X, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import { courseMaterialService } from '@/services/courseMaterialService';

interface SecureViewerProps {
  materialId: number;
  materialTitle: string;
  mimeType: string;
  onClose: () => void;
}

export default function SecureViewer({ 
  materialId, 
  materialTitle, 
  mimeType,
  onClose 
}: SecureViewerProps) {
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Disable context menu, copy, and other interactions
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert('Copying is not allowed for this material.');
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Cmd+C, Ctrl+S, Cmd+S, Print Screen
      if (
        (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 's' || e.key === 'p') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        if (e.key === 'PrintScreen') {
          courseMaterialService.reportScreenshotAttempt(materialId);
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', preventDefaults);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('keydown', preventKeyboard);

    // Add drag prevention
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };
    document.addEventListener('dragstart', preventDrag);

    return () => {
      document.removeEventListener('contextmenu', preventDefaults);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('keydown', preventKeyboard);
      document.removeEventListener('dragstart', preventDrag);
    };
  }, [materialId]);

  // Fetch secure URL and token
  const fetchSecureUrl = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate token
      const tokenResponse = await courseMaterialService.getViewingToken(materialId);
      setTokenExpiry(new Date(tokenResponse.expiresAt));

      // Get secure URL
      const urlResponse = await courseMaterialService.getSecureUrl(tokenResponse.token);
      setSecureUrl(urlResponse.secureUrl);

      // Set up auto-refresh before token expires (refresh at 80% of token lifetime)
      const expiryTime = new Date(tokenResponse.expiresAt).getTime();
      const currentTime = Date.now();
      const tokenLifetime = expiryTime - currentTime;
      const refreshTime = tokenLifetime * 0.8;

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      refreshTimerRef.current = setTimeout(() => {
        console.log('Auto-refreshing token...');
        fetchSecureUrl();
      }, refreshTime);

    } catch (err: any) {
      console.error('Failed to fetch secure URL:', err);
      setError(err.response?.data?.message || 'Failed to load material. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  useEffect(() => {
    fetchSecureUrl();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [fetchSecureUrl]);

  const handleClose = () => {
    if (confirm('Are you sure you want to close this material?')) {
      onClose();
    }
  };

  const handleRefresh = () => {
    fetchSecureUrl();
  };

  const renderContent = () => {
    if (!secureUrl) return null;

    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType === 'application/pdf';
    const isVideo = mimeType.startsWith('video/');

    if (isImage) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#1E293B]">
          {/* Protection overlay */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ 
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          <img 
            src={secureUrl}
            alt={materialTitle}
            className="max-w-full max-h-full object-contain"
            style={{ 
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="relative w-full h-full">
          {/* Protection overlay */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ 
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
          <iframe
            src={`${secureUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            style={{ 
              pointerEvents: 'auto',
              userSelect: 'none'
            }}
            title={materialTitle}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#1E293B]">
          <video
            src={secureUrl}
            controls
            controlsList="nodownload nofullscreen"
            disablePictureInPicture
            className="max-w-full max-h-full"
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      );
    }

    // Default: try iframe for other document types
    return (
      <div className="relative w-full h-full">
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
        <iframe
          src={secureUrl}
          className="w-full h-full border-0"
          title={materialTitle}
        />
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000000] flex flex-col"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {/* Header */}
      <div className="bg-[#1E293B] px-4 py-3 flex items-center justify-between border-b border-[#334155]">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-medium truncate">{materialTitle}</h2>
          {tokenExpiry && (
            <p className="text-xs text-[#94A3B8] mt-1">
              Token expires: {tokenExpiry.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-[#334155] text-white border-[#475569] hover:bg-[#475569]"
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-2 bg-[#334155] text-white border-[#475569] hover:bg-[#475569]"
          >
            <X className="size-4" />
            Close
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden" ref={contentRef}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B]">
            <div className="text-center">
              <Loader2 className="size-8 animate-spin text-[#1E88E5] mx-auto mb-2" />
              <p className="text-white text-sm">Loading material...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B]">
            <div className="text-center max-w-md px-4">
              <AlertCircle className="size-12 text-[#EF4444] mx-auto mb-3" />
              <p className="text-white font-medium mb-2">Failed to Load Material</p>
              <p className="text-[#94A3B8] text-sm mb-4">{error}</p>
              <Button onClick={handleRefresh} className="flex items-center gap-2 mx-auto">
                <RefreshCw className="size-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && renderContent()}
      </div>

      {/* Footer - Protection Notice */}
      <div className="bg-[#1E293B] px-4 py-2 border-t border-[#334155]">
        <p className="text-xs text-[#94A3B8] text-center">
          🔒 This material is protected. Download, copy, and sharing are disabled.
        </p>
      </div>

      {/* CSS for additional protection */}
      <style jsx>{`
        * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        img {
          pointer-events: none !important;
          -webkit-user-drag: none !important;
        }
      `}</style>
    </div>
  );
}
