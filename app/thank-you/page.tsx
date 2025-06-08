// app/thank-you/page.tsx
'use client';

import { Suspense } from 'react';
import ThankYouContent from './thank-you-content';

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
