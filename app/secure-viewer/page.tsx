'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { courseMaterialService } from '@/services/courseMaterialService';
import SecureViewer from '@/components/SecureViewer';

function SecureViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const materialId = searchParams.get('materialId');
  const materialTitle = searchParams.get('title');
  const fileType = searchParams.get('fileType');
  const mimeType = searchParams.get('mimeType');

  if (!materialId || !materialTitle || !mimeType) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Invalid Request</h3>
          <p className="text-gray-400">Required parameters are missing.</p>
        </div>
      </div>
    );
  }

  return (
    <SecureViewer
      materialId={parseInt(materialId)}
      materialTitle={materialTitle}
      mimeType={mimeType}
      onClose={() => window.close()}
    />
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
