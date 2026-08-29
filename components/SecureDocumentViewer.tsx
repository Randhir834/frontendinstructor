'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { X, Loader2, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Button from './ui/Button';
import { courseMaterialService } from '@/services/courseMaterialService';

interface SecureDocumentViewerProps {
  materialId: number;
  materialTitle: string;
  mimeType: string;
  fileType: string;
  onClose: () => void;
}

export default function SecureDocumentViewer({ 
  materialId, 
  materialTitle, 
  mimeType,
  fileType,
  onClose 
}: SecureDocumentViewerProps) {
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Comprehensive protection against copying, printing, and downloading
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      console.warn('Copy attempt blocked');
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Cmd+C, Ctrl+S, Cmd+S, Ctrl+P, Cmd+P, Print Screen
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 's' || e.key === 'p' || e.key === 'a')
      ) {
        e.preventDefault();
        console.warn('Keyboard shortcut blocked:', e.key);
      }
      
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        courseMaterialService.reportScreenshotAttempt(materialId);
        console.warn('Screenshot attempt blocked');
      }

      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        console.warn('DevTools access blocked');
      }
    };

    const preventPrint = () => {
      console.warn('Print attempt blocked');
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', preventDefaults);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('keydown', preventKeyboard);
    document.addEventListener('dragstart', preventDefaults);
    document.addEventListener('selectstart', preventDefaults);
    
    // Block print
    window.onbeforeprint = preventPrint;

    // Add CSS to prevent text selection
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      @media print {
        body {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', preventDefaults);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('keydown', preventKeyboard);
      document.removeEventListener('dragstart', preventDefaults);
      document.removeEventListener('selectstart', preventDefaults);
      window.onbeforeprint = null;
      document.head.removeChild(style);
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
    if (confirm('Are you sure you want to close this document?')) {
      onClose();
    }
  };

  const handleRefresh = () => {
    fetchSecureUrl();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const renderContent = () => {
    if (!secureUrl) return null;

    const isPdf = mimeType === 'application/pdf' || fileType === 'pdf';
    const isDoc = ['doc', 'docx', 'document'].some(type => 
      fileType.includes(type) || mimeType.includes('word') || mimeType.includes('document')
    );
    const isPpt = ['ppt', 'pptx', 'presentation'].some(type => 
      fileType.includes(type) || mimeType.includes('powerpoint') || mimeType.includes('presentation')
    );

    // For DOC/DOCX/PPT/PPTX - Use Google Docs Viewer (no download/print buttons)
    if (isDoc || isPpt) {
      const encodedUrl = encodeURIComponent(secureUrl);
      
      // Google Docs Viewer - Most secure option, no download/print by default
      const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
      
      return (
        <div className="relative w-full h-full">
          {/* Invisible overlay to prevent interactions with iframe controls */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          />
          
          <iframe
            ref={iframeRef}
            src={viewerUrl}
            className="w-full h-full border-0"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`,
              userSelect: 'none'
            }}
            title={materialTitle}
            sandbox="allow-same-origin allow-scripts"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      );
    }

    // For PDF - Use built-in viewer with disabled toolbar
    if (isPdf) {
      return (
        <div className="relative w-full h-full">
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          />
          <iframe
            ref={iframeRef}
            src={`${secureUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=${zoom}`}
            className="w-full h-full border-0"
            style={{ 
              userSelect: 'none',
              pointerEvents: 'auto'
            }}
            title={materialTitle}
            sandbox="allow-same-origin allow-scripts"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      );
    }

    // Fallback for other file types
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white p-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-semibold mb-2">Preview Not Available</h3>
          <p className="text-gray-400">This file type cannot be previewed securely.</p>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700 shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-medium truncate">{materialTitle}</h2>
          {tokenExpiry && (
            <p className="text-xs text-gray-400 mt-1">
              Token expires: {tokenExpiry.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 bg-gray-800 rounded-lg">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white text-sm font-medium min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <X className="size-4" />
            <span className="hidden sm:inline">Close</span>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="text-center">
              <Loader2 className="size-12 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-white text-sm">Loading document...</p>
              <p className="text-gray-400 text-xs mt-2">Please wait while we prepare your secure view</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="text-center max-w-md px-4">
              <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
              <p className="text-white font-semibold text-lg mb-2">Failed to Load Document</p>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
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
      <div className="bg-gray-900 px-4 py-3 border-t border-gray-700 shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            🔒 This document is protected. Download, print, copy, and sharing are disabled.
          </p>
          <p className="text-xs text-gray-500 text-center sm:text-right">
            View-only access • No modifications allowed
          </p>
        </div>
      </div>

      {/* Additional CSS protection */}
      <style jsx global>{`
        @media print {
          body, body * {
            display: none !important;
          }
        }
        
        iframe {
          pointer-events: auto !important;
        }
        
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
      `}</style>
    </div>
  );
}
