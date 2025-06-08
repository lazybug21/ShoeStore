import { Suspense } from 'react';
import CheckoutPageClient from './CheckoutPageClient';

export default function CheckoutWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
