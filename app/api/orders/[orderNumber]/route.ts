import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  context: any 
) {
  try {
    const orderNumber = context.params?.orderNumber;
    await dbConnect();

    const order = await Order.findOne({ orderNumber: orderNumber });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
