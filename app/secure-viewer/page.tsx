'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ZoomIn, ZoomOut, Pen, Eraser, Undo, Redo, Trash2 } from 'lucide-react';
import { courseMaterialService } from '@/services/courseMaterialService';

function SecureViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const materialId = searchParams.get('materialId');
  const materialTitle = searchParams.get('title');
  const fileType = searchParams.get('fileType');
  const mimeType = searchParams.get('mimeType');

  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Annotation states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [annotationEnabled, setAnnotationEnabled] = useState(false); // Default: OFF
  const [annotationMode, setAnnotationMode] = useState<'draw' | 'erase' | null>(null);
  const [penColor, setPenColor] = useState('#FF0000'); // Red default
  const [penSize, setPenSize] = useState(3);
  const [annotations, setAnnotations] = useState<ImageData[]>([]);
  const [currentAnnotationIndex, setCurrentAnnotationIndex] = useState(-1);

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
        if (materialId) {
          courseMaterialService.reportScreenshotAttempt(parseInt(materialId));
        }
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

    return () => {
      document.removeEventListener('contextmenu', preventDefaults);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('keydown', preventKeyboard);
      document.removeEventListener('dragstart', preventDefaults);
      document.removeEventListener('selectstart', preventDefaults);
      window.onbeforeprint = null;
    };
  }, [materialId]);

  // Fetch secure URL and token
  const fetchSecureUrl = useCallback(async () => {
    if (!materialId) {
      setError('Material ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate token
      const tokenResponse = await courseMaterialService.getViewingToken(parseInt(materialId));

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  // Toggle annotation mode
  const toggleAnnotation = () => {
    const newState = !annotationEnabled;
    setAnnotationEnabled(newState);
    
    // When enabling, auto-select draw tool
    if (newState) {
      setAnnotationMode('draw');
    } else {
      // When disabling, clear mode
      setAnnotationMode(null);
    }
  };

  // Annotation functions
  const saveAnnotationState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newAnnotations = annotations.slice(0, currentAnnotationIndex + 1);
    newAnnotations.push(imageData);
    setAnnotations(newAnnotations);
    setCurrentAnnotationIndex(newAnnotations.length - 1);
  };

  const undo = () => {
    if (currentAnnotationIndex > 0) {
      setCurrentAnnotationIndex(currentAnnotationIndex - 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.putImageData(annotations[currentAnnotationIndex - 1], 0, 0);
      }
    }
  };

  const redo = () => {
    if (currentAnnotationIndex < annotations.length - 1) {
      setCurrentAnnotationIndex(currentAnnotationIndex + 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.putImageData(annotations[currentAnnotationIndex + 1], 0, 0);
      }
    }
  };

  const clearAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAnnotations([]);
    setCurrentAnnotationIndex(-1);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!annotationEnabled || !annotationMode) return; // Check if annotation is enabled
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !annotationEnabled || !annotationMode) return; // Check if annotation is enabled
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (annotationMode === 'draw') {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (annotationMode === 'erase') {
      ctx.clearRect(x - penSize * 2, y - penSize * 2, penSize * 4, penSize * 4);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveAnnotationState();
    }
  };

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore last annotation if exists
      if (currentAnnotationIndex >= 0 && annotations[currentAnnotationIndex]) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(annotations[currentAnnotationIndex], 0, 0);
        }
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [annotations, currentAnnotationIndex]);

  const renderContent = () => {
    if (!secureUrl) return null;

    const isDoc = ['doc', 'docx', 'document'].some(type => 
      fileType?.includes(type) || mimeType?.includes('word') || mimeType?.includes('document')
    );
    const isPpt = ['ppt', 'pptx', 'presentation'].some(type => 
      fileType?.includes(type) || mimeType?.includes('powerpoint') || mimeType?.includes('presentation')
    );

    // For DOC/DOCX/PPT/PPTX - Use Google Docs Viewer (no download/print buttons)
    if (isDoc || isPpt) {
      const encodedUrl = encodeURIComponent(secureUrl);
      
      // Google Docs Viewer - Most secure option, no download/print by default
      const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
      
      return (
        <div className="relative w-full h-full overflow-auto">
          {/* Document iframe - Always allow interaction unless annotating */}
          <iframe
            ref={iframeRef}
            src={viewerUrl}
            className="w-full h-full border-0 absolute inset-0"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`,
              userSelect: 'none',
              pointerEvents: annotationEnabled && annotationMode ? 'none' : 'auto' // Allow interaction when annotation is OFF
            }}
            title={materialTitle || 'Document'}
            sandbox="allow-same-origin allow-scripts"
            onContextMenu={(e) => e.preventDefault()}
          />
          
          {/* Annotation canvas overlay - Only captures events when annotation is enabled */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
              cursor: annotationEnabled && annotationMode === 'draw' ? 'crosshair' 
                    : annotationEnabled && annotationMode === 'erase' ? 'pointer' 
                    : 'default',
              pointerEvents: annotationEnabled && annotationMode ? 'auto' : 'none', // Only capture when annotation is ON
              touchAction: 'none'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      );
    }

    // Fallback
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

  if (!materialId) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Invalid Request</h3>
          <p className="text-gray-400">Material ID is required.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col"
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
          <h2 className="text-white font-medium truncate">{materialTitle || 'Document Viewer'}</h2>
        </div>
        
        <div className="flex items-center gap-3 ml-4">
          {/* Enable Annotation Toggle Button */}
          <button
            onClick={toggleAnnotation}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              annotationEnabled 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={annotationEnabled ? 'Disable Annotation' : 'Enable Annotation'}
          >
            {annotationEnabled ? '✏️ Annotation ON' : '✏️ Enable Annotation'}
          </button>
          
          {/* Annotation Tools - Only visible when annotation is enabled */}
          {annotationEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
              {/* Draw tool */}
              <button
                onClick={() => setAnnotationMode(annotationMode === 'draw' ? 'draw' : 'draw')}
                className={`p-1.5 rounded transition-colors ${
                  annotationMode === 'draw' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Draw"
              >
                <Pen className="w-4 h-4" />
              </button>
              
              {/* Eraser tool */}
              <button
                onClick={() => setAnnotationMode(annotationMode === 'erase' ? 'draw' : 'erase')}
                className={`p-1.5 rounded transition-colors ${
                  annotationMode === 'erase' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>
              
              <div className="w-px h-5 bg-gray-700" />
              
              {/* Color picker */}
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                title="Pen Color"
              />
              
              {/* Pen size slider */}
              <input
                type="range"
                min="1"
                max="10"
                value={penSize}
                onChange={(e) => setPenSize(parseInt(e.target.value))}
                className="w-16 h-2 bg-gray-700 rounded-lg cursor-pointer"
                title="Pen Size"
              />
              
              <div className="w-px h-5 bg-gray-700" />
              
              {/* Undo */}
              <button
                onClick={undo}
                disabled={currentAnnotationIndex <= 0}
                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              
              {/* Redo */}
              <button
                onClick={redo}
                disabled={currentAnnotationIndex >= annotations.length - 1}
                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
              
              {/* Clear all */}
              <button
                onClick={clearAnnotations}
                className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                title="Clear All Annotations"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
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
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-white text-sm">Loading document...</p>
              <p className="text-gray-400 text-xs mt-2">Please wait while we prepare your secure view</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="text-center max-w-md px-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-white font-semibold text-lg mb-2">Failed to Load Document</p>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <p className="text-gray-500 text-sm">Please close this tab and try again from the course page.</p>
            </div>
          </div>
        )}

        {!loading && !error && renderContent()}
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

export default function SecureViewerPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    }>
      <SecureViewerContent />
    </Suspense>
  );
}
