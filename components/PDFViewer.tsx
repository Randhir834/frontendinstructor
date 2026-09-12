'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Button from './ui/Button';
import type { Annotation } from './SecureViewer';

interface PDFViewerProps {
  url: string;
  annotations: Annotation[];
  isAnnotating: boolean;
  selectedAnnotation: string | null;
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  onSelectAnnotation: (id: string | null) => void;
}

export default function PDFViewer({
  url,
  annotations,
  isAnnotating,
  selectedAnnotation,
  onAddAnnotation,
  onSelectAnnotation,
}: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);

  // Load PDF.js dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Load PDF.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        
        script.onload = async () => {
          // @ts-ignore
          const pdfjsLib = window.pdfjsLib;
          if (pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            try {
              const loadedPdf = await pdfjsLib.getDocument(url).promise;
              setPdf(loadedPdf);
              setTotalPages(loadedPdf.numPages);
              setLoading(false);
            } catch (error) {
              console.error('Error loading PDF:', error);
              setLoading(false);
            }
          }
        };
        
        document.head.appendChild(script);
        
        return () => {
          document.head.removeChild(script);
        };
      } catch (error) {
        console.error('Error loading PDF.js:', error);
        setLoading(false);
      }
    };

    loadPdfJs();
  }, [url]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Render annotations for this page
        renderAnnotations();
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  // Render annotations overlay
  const renderAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const pageAnnotations = annotations.filter(ann => ann.pageNumber === currentPage);

    pageAnnotations.forEach(annotation => {
      context.strokeStyle = annotation.color;
      context.lineWidth = 3;
      context.strokeRect(
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height
      );

      // Highlight selected annotation
      if (annotation.id === selectedAnnotation) {
        context.fillStyle = annotation.color + '40'; // Add transparency
        context.fillRect(
          annotation.x,
          annotation.y,
          annotation.width,
          annotation.height
        );
      }
    });
  };

  // Handle click to add annotation
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAnnotating || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a small box at click position
    const width = 100;
    const height = 50;

    onAddAnnotation({
      pageNumber: currentPage,
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      text: '',
      color: '#3B82F6', // Blue color
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onSelectAnnotation(null);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onSelectAnnotation(null);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  // Disable right-click and other protections
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('contextmenu', preventDefaults);
      canvas.addEventListener('dragstart', preventDefaults);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('contextmenu', preventDefaults);
        canvas.removeEventListener('dragstart', preventDefaults);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1E293B]">
        <p className="text-white">Loading PDF...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-[#1E293B] overflow-auto"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* PDF Controls */}
      <div className="sticky top-0 z-20 bg-[#1E293B] border-b border-[#334155] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="bg-[#334155] text-white border-[#475569] hover:bg-[#475569] disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-white text-sm px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="bg-[#334155] text-white border-[#475569] hover:bg-[#475569] disabled:opacity-50"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="bg-[#334155] text-white border-[#475569] hover:bg-[#475569] disabled:opacity-50"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="text-white text-sm px-3">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3}
            className="bg-[#334155] text-white border-[#475569] hover:bg-[#475569] disabled:opacity-50"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex justify-center p-8">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`shadow-2xl ${isAnnotating ? 'cursor-crosshair' : 'cursor-default'}`}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            maxWidth: '100%',
          }}
        />
      </div>
    </div>
  );
}
