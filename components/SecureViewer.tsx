'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { X, Loader2, RefreshCw, AlertCircle, Edit3, Trash2, Download } from 'lucide-react';
import Button from './ui/Button';
import { courseMaterialService } from '@/services/courseMaterialService';
import dynamic from 'next/dynamic';

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

interface SecureViewerProps {
  materialId: number;
  materialTitle: string;
  mimeType: string;
  onClose: () => void;
}

export interface Annotation {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  createdAt: Date;
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
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get user info for watermark
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.name || payload.email || 'Instructor');
      } catch (error) {
        console.error('Failed to parse token:', error);
        setUserName('Instructor');
      }
    }
  }, []);

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
      // Prevent Ctrl+C, Cmd+C, Ctrl+S, Cmd+S, Ctrl+P, Cmd+P, Print Screen
      if (
        (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 's' || e.key === 'p') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        if (e.key === 'PrintScreen') {
          alert('Screenshots are not allowed for this material.');
          courseMaterialService.reportScreenshotAttempt(materialId);
        }
        if (e.key === 'p') {
          alert('Printing is not allowed for this material.');
        }
      }
    };

    // Detect when window loses focus (possible screenshot attempt)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Log potential screenshot attempt
        console.warn('Window lost focus - possible screenshot attempt');
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', preventDefaults);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('keydown', preventKeyboard);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Add drag prevention
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };
    document.addEventListener('dragstart', preventDrag);

    // Disable developer tools detection (basic)
    const detectDevTools = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Cmd+Option+I
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'I')
      ) {
        e.preventDefault();
        alert('Developer tools are disabled for security.');
      }
    };
    document.addEventListener('keydown', detectDevTools);

    return () => {
      document.removeEventListener('contextmenu', preventDefaults);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('keydown', preventKeyboard);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('keydown', detectDevTools);
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

  // Annotation handlers
  const addAnnotation = (annotation: Omit<Annotation, 'id' | 'createdAt'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `ann-${Date.now()}-${Math.random()}`,
      createdAt: new Date(),
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const updateAnnotation = (id: string, text: string) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, text } : ann
    ));
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedAnnotation === id) {
      setSelectedAnnotation(null);
    }
  };

  const toggleAnnotationMode = () => {
    setIsAnnotating(!isAnnotating);
    setSelectedAnnotation(null);
  };

  const renderContent = () => {
    if (!secureUrl) return null;

    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType === 'application/pdf';
    const isVideo = mimeType.startsWith('video/');
    const isDoc = mimeType.includes('word') || mimeType.includes('document');
    const isPpt = mimeType.includes('powerpoint') || mimeType.includes('presentation');

    // Use custom PDF viewer with annotation support
    if (isPdf) {
      return (
        <PDFViewer
          url={secureUrl}
          annotations={annotations}
          isAnnotating={isAnnotating}
          selectedAnnotation={selectedAnnotation}
          onAddAnnotation={addAnnotation}
          onSelectAnnotation={setSelectedAnnotation}
        />
      );
    }

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

    if (isVideo) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#1E293B]">
          <video
            src={secureUrl}
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
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
            src={viewerUrl}
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
          {mimeType === 'application/pdf' && (
            <Button
              variant={isAnnotating ? "gradient" : "outline"}
              size="sm"
              onClick={toggleAnnotationMode}
              className={`flex items-center gap-2 ${
                isAnnotating 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none' 
                  : 'bg-[#334155] text-white border-[#475569] hover:bg-[#475569]'
              }`}
            >
              <Edit3 className="size-4" />
              {isAnnotating ? 'Exit Annotate' : 'Annotate'}
            </Button>
          )}
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
        {/* Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 200px,
              rgba(255, 255, 255, 0.03) 200px,
              rgba(255, 255, 255, 0.03) 400px
            )`,
          }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/10 text-xs font-bold select-none"
                style={{
                  top: `${(i * 100) % 800}px`,
                  left: `${(i * 150) % 1200}px`,
                  transform: 'rotate(-45deg)',
                  whiteSpace: 'nowrap',
                }}
              >
                {userName} • {new Date().toLocaleString()} • {materialTitle.slice(0, 20)}
              </div>
            ))}
          </div>
        </div>

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

        {/* Annotation Sidebar */}
        {mimeType === 'application/pdf' && annotations.length > 0 && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#1E293B] border-l border-[#334155] overflow-y-auto">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Edit3 className="size-4" />
                Annotations ({annotations.length})
              </h3>
              <div className="space-y-3">
                {annotations.map(annotation => (
                  <div
                    key={annotation.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAnnotation === annotation.id
                        ? 'bg-blue-900/30 border-blue-500'
                        : 'bg-[#334155] border-[#475569] hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedAnnotation(annotation.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs text-[#94A3B8]">Page {annotation.pageNumber}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this annotation?')) {
                            deleteAnnotation(annotation.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                    <textarea
                      value={annotation.text}
                      onChange={(e) => updateAnnotation(annotation.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-[#1E293B] text-white text-sm p-2 rounded border border-[#475569] focus:border-blue-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Add your notes..."
                    />
                    <p className="text-xs text-[#94A3B8] mt-2">
                      {annotation.createdAt.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Protection Notice */}
      <div className="bg-[#1E293B] px-4 py-2 border-t border-[#334155]">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#94A3B8]">
            🔒 This material is protected. Download, copy, and sharing are disabled.
          </p>
          {mimeType === 'application/pdf' && isAnnotating && (
            <p className="text-xs text-blue-400 font-medium">
              Click anywhere on the PDF to add annotations
            </p>
          )}
        </div>
      </div>

      {/* CSS for additional protection */}
      <style jsx global>{`
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
        canvas {
          -webkit-user-drag: none !important;
          user-select: none !important;
        }
        /* Disable print */
        @media print {
          body {
            display: none !important;
          }
        }
        /* Hide print button in PDF viewers */
        embed[type="application/pdf"],
        object[type="application/pdf"] {
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
