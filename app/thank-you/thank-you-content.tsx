// app/thank-you/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, Loader2, Mail, Home, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Order {
  orderNumber: string;
  product: {
    productId: string;
    name: string;
    price: number;
    variants: Record<string, string>;
    quantity: number;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    status: 'approved' | 'declined' | 'error';
  };
  total: number;
  createdAt: string;
}

export default function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>We couldn't find the order you're looking for.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isApproved = order.payment.status === 'approved';
  const isDeclined = order.payment.status === 'declined';
  const isError = order.payment.status === 'error';

  const statusIcon = isApproved 
    ? <CheckCircle className="h-16 w-16 text-green-500" />
    : isDeclined 
    ? <XCircle className="h-16 w-16 text-red-500" />
    : <AlertCircle className="h-16 w-16 text-yellow-500" />;

  const statusTitle = isApproved
    ? 'Order Confirmed!'
    : isDeclined
    ? 'Payment Declined'
    : 'Payment Error';

  const statusMessage = isApproved
    ? 'Your order has been successfully placed and will be shipped soon.'
    : isDeclined
    ? 'Your payment was declined. Please try again with a different payment method.'
    : 'There was an error processing your payment. Please try again later.';

  const maskedCardNumber = `****-****-****-${order.payment.cardNumber.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">ShoeStore</h1>
            <Button variant="outline" onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 justify-items-center">
          {statusIcon}
          <h1 className="text-3xl font-bold mt-4">{statusTitle}</h1>
          <p className="text-gray-600 mt-2">{statusMessage}</p>
          <p className="text-lg font-semibold mt-4">Order Number: {order.orderNumber}</p>
        </div>

        {isApproved && (
          <Alert className="mb-6">
            <Mail className="h-4 w-4" />
            <AlertTitle>Confirmation Email Sent</AlertTitle>
            <AlertDescription>
              We've sent a confirmation email to {order.customer.email} with your order details.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Package className="h-12 w-12 text-gray-400" />
                <div className="flex-1">
                  <h3 className="font-semibold">{order.product.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {order.product.quantity}</p>
                  {Object.entries(order.product.variants).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-600">
                      {key}: {value}
                    </p>
                  ))}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(order.product.price * order.product.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(order.total - (order.product.price * order.product.quantity)).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <Badge variant={isApproved ? 'default' : 'destructive'}>
                  Payment {order.payment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{order.customer.fullName}</p>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p>Email: {order.customer.email}</p>
                <p>Phone: {order.customer.phone}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p>Card Number: {maskedCardNumber}</p>
                <p>Expiry: {order.payment.expiryDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {!isApproved && (
          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => router.push('/')}>
              Try Again
            </Button>
          </div>
        )}

        {isApproved && (
          <Alert className="mt-8">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>What's Next?</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You'll receive tracking information once your order ships</li>
                <li>Expected delivery: 3-5 business days</li>
                <li>For questions about your order, contact support@shoestore.com</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}