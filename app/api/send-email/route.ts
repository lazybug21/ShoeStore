import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { order } = await request.json();
    
    // Gmail-only transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    const isApproved = order.payment.status === 'approved';
    
    const subject = isApproved 
      ? `Order Confirmed #${order.orderNumber} - ShoeStore`
      : `Payment Failed #${order.orderNumber} - ShoeStore`;
    
    const html = isApproved ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            text-align: center; 
            padding: 40px 30px;
          }
          .header h1 { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 8px;
          }
          .header p { 
            font-size: 18px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #2d3748;
          }
          .order-card { 
            background: #f7fafc; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
          }
          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          .order-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
          }
          .order-status {
            background: #48bb78;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .product-info {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
          }
          .product-name {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
          }
          .product-details {
            color: #718096;
            font-size: 14px;
            margin-bottom: 12px;
          }
          .total-price {
            font-size: 24px;
            font-weight: 700;
            color: #48bb78;
            text-align: right;
          }
          .shipping-info {
            background: #edf2f7;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .shipping-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
          }
          .address {
            color: #4a5568;
            line-height: 1.5;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 24px 0;
            transition: transform 0.2s;
          }
          .next-steps {
            background: #e6fffa;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .next-steps h3 {
            color: #2d3748;
            margin-bottom: 12px;
          }
          .next-steps ul {
            margin-left: 20px;
            color: #4a5568;
          }
          .next-steps li {
            margin-bottom: 8px;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f7fafc;
            color: #718096;
            font-size: 14px;
          }
          .footer strong {
            color: #2d3748;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Your order has been successfully placed</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Hi <strong>${order.customer.fullName}</strong>,
            </div>
            <p>Thank you for choosing ShoeStore! Your order is confirmed and we're getting your shoes ready for shipment.</p>
            
            <div class="order-card">
              <div class="order-header">
                <div class="order-title">Order #${order.orderNumber}</div>
                <div class="order-status">✓ Confirmed</div>
              </div>
              
              <div class="product-info">
                <div class="product-name">${order.product.name}</div>
                <div class="product-details">
                  Quantity: ${order.product.quantity} • 
                  ${Object.entries(order.product.variants).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                </div>
                <div class="total-price">$${order.total.toFixed(2)}</div>
              </div>
            </div>
            
            <div class="shipping-info">
              <div class="shipping-title">📦 Shipping Address</div>
              <div class="address">
                ${order.customer.fullName}<br>
                ${order.customer.address}<br>
                ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
              </div>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/thank-you?orderNumber=${order.orderNumber}" class="cta-button">
                View Order Details →
              </a>
            </center>
            
            <div class="next-steps">
              <h3>📋 What happens next?</h3>
              <ul>
                <li><strong>Processing:</strong> 1-2 business days</li>
                <li><strong>Shipping:</strong> 3-5 business days</li>
                <li><strong>Tracking:</strong> You'll receive tracking info via email</li>
                <li><strong>Returns:</strong> Free returns within 30 days</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>ShoeStore</strong> - Step into Style</p>
            <p>© 2024 ShoeStore. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); 
            color: white; 
            text-align: center; 
            padding: 40px 30px;
          }
          .header h1 { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 8px;
          }
          .header p { 
            font-size: 18px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #2d3748;
          }
          .error-card { 
            background: #fed7d7; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #f56565;
          }
          .error-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
          }
          .product-info {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
          }
          .retry-steps {
            background: #e6fffa;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .retry-steps h3 {
            color: #2d3748;
            margin-bottom: 12px;
          }
          .retry-steps ul {
            margin-left: 20px;
            color: #4a5568;
          }
          .retry-steps li {
            margin-bottom: 8px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 24px 0;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f7fafc;
            color: #718096;
            font-size: 14px;
          }
          .footer strong {
            color: #2d3748;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Payment Failed</h1>
            <p>There was an issue processing your payment</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Hi <strong>${order.customer.fullName}</strong>,
            </div>
            <p>We're sorry, but we couldn't process your payment for this order. Don't worry - this happens sometimes and can usually be fixed easily!</p>
            
            <div class="error-card">
              <div class="error-title">Order #${order.orderNumber}</div>
              
              <div class="product-info">
                <strong>Product:</strong> ${order.product.name}<br>
                <strong>Total:</strong> $${order.total.toFixed(2)}<br>
                <strong>Issue:</strong> ${order.payment.status === 'declined' ? 'Card was declined by your bank' : 'Payment gateway error occurred'}
              </div>
            </div>
            
            <div class="retry-steps">
              <h3>🔧 How to fix this:</h3>
              <ul>
                <li><strong>Try a different card</strong> - Use another payment method</li>
                <li><strong>Check your details</strong> - Verify card number, expiry, and CVV</li>
                <li><strong>Contact your bank</strong> - They may have blocked the transaction</li>
                <li><strong>Try again</strong> - Sometimes it's just a temporary issue</li>
              </ul>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="cta-button">
                Try Again →
              </a>
            </center>
            
            <p style="text-align: center; color: #718096; font-style: italic; margin-top: 24px;">
              Your shoes are still waiting for you! ✨
            </p>
          </div>
          
          <div class="footer">
            <p><strong>ShoeStore</strong> - Step into Style</p>
            <p>© 2024 ShoeStore. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: `ShoeStore <${process.env.SMTP_USER}>`,
      to: order.customer.email,
      subject,
      html,
    };
    
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully to ${order.customer.email} via Gmail`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully via Gmail'
    });
    
  } catch (error) {
    console.error('❌ Gmail sending error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email via Gmail', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}