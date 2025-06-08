import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

function generateOrderNumber() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

function determinePaymentStatus(cardNumber: string): 'approved' | 'declined' | 'error' {
  const firstDigit = cardNumber.charAt(0);
  switch (firstDigit) {
    case '1':
      return 'approved';
    case '2':
      return 'declined';
    case '3':
      return 'error';
    default:
      return 'approved'; // Default to approved for other numbers
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Determine payment status based on card number
    const paymentStatus = determinePaymentStatus(body.payment.cardNumber);
    
    // Create order with payment status
    const orderData = {
      ...body,
      orderNumber: generateOrderNumber(),
      payment: {
        ...body.payment,
        status: paymentStatus
      }
    };
    
    const order = new Order(orderData);
    await order.save();
    
    // Update product inventory only if payment is approved
    if (paymentStatus === 'approved') {
      await Product.findByIdAndUpdate(
        body.product.productId,
        { $inc: { inventory: -body.product.quantity } }
      );
    }
    
    return NextResponse.json({
      success: true,
      order: order,
      paymentStatus: paymentStatus
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}