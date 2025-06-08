# eCommerce Checkout Flow Simulation

A full-stack Next.js application simulating a complete eCommerce checkout experience with payment processing simulation, email notifications, and inventory management.


## 📋 Features

### 🛍️ Complete Shopping Flow
- **Landing Page**: Product showcase with variant selection (size, color)
- **Checkout Page**: Comprehensive form with validation
- **Thank You Page**: Order confirmation with complete details

### 💳 Payment Simulation
- **Approved Transactions**: Use card numbers starting with `1`
- **Declined Transactions**: Use card numbers starting with `2` 
- **Gateway Errors**: Use card numbers starting with `3`
- Complete transaction status handling and user feedback

### 📧 Email Notifications
- **Success Emails**: Order confirmation with complete details
- **Failure Emails**: Payment declined/error notifications with retry options
- Powered by Mailtrap.io for reliable email delivery

### 🔐 Form Validation
- Real-time client-side validation
- Email format validation
- Phone number validation (10 digits)
- Credit card validation (16 digits)
- Expiry date validation (future dates only)
- CVV validation (3 digits)
- Address and ZIP code validation

### 📊 Database Management
- Order storage with unique order numbers
- Product inventory tracking
- Customer information storage
- Automatic inventory updates on successful purchases

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling and responsive design
- **shadcn/ui** - Modern UI components
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side functionality
- **MongoDB** - Database for orders and products
- **Mongoose** - MongoDB object modeling

### Email Service
- **Nodemailer** - Email sending
- **Mailtrap.io** - Email testing and delivery

### Form Handling
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── orders/            # Order management endpoints
│   │   ├── products/          # Product data endpoints
│   │   └── send-email/        # Email notification endpoint
│   ├── checkout/              # Checkout page
│   ├── thank-you/             # Order confirmation page
│   └── page.tsx               # Landing page
├── components/
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── mongodb.ts             # Database connection
│   ├── seed-products.ts       # Sample data seeding
│   └── utils.ts               # Utility functions
├── models/
│   ├── Order.ts               # Order data model
│   └── Product.ts             # Product data model
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Mailtrap.io account (for email testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-checkout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string
   
   # Mailtrap Configuration
   MAILTRAP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USER=your_mailtrap_username
   MAILTRAP_PASS=your_mailtrap_password
   MAILTRAP_FROM=noreply@store.com
   
   # Application URL (for email links)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Seed the database** (Optional)
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Payment Scenarios

Use these card number patterns to test different payment outcomes:

| Card Number Start | Result | Example |
|-------------------|--------|---------|
| `1` | ✅ Approved | `1234567890123456` |
| `2` | ❌ Declined | `2234567890123456` |
| `3` | ⚠️ Gateway Error | `3234567890123456` |

- **CVV**: Any 3-digit number (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)

## 📧 Email Configuration

### Mailtrap Setup
1. Create a free account at [Mailtrap.io](https://mailtrap.io)
2. Get your SMTP credentials from the inbox settings
3. Add credentials to your `.env.local` file
4. Test emails will appear in your Mailtrap inbox

### Email Templates
- **Success Email**: Order confirmation with complete order details
- **Failure Email**: Payment failure notification with retry options

## 🗄️ Database Models

### Order Schema
```typescript
{
  orderNumber: String (unique)
  product: {
    productId: String
    name: String
    price: Number
    variants: Object
    quantity: Number
  }
  customer: {
    fullName: String
    email: String
    phone: String
    address: String
    city: String
    state: String
    zipCode: String
  }
  payment: {
    cardNumber: String
    expiryDate: String
    cvv: String
    status: 'approved' | 'declined' | 'error'
  }
  total: Number
  createdAt: Date
}
```

### Product Schema
```typescript
{
  name: String
  description: String
  price: Number
  image: String
  variants: [{
    type: String
    options: [String]
  }]
  inventory: Number
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build command and environment variables
- **Railway**: Set up MongoDB and environment variables
- **Render**: Configure web service with environment variables

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run seed        # Seed database with sample products

# Code Quality
npm run lint        # Run ESLint
```

## 🌟 Key Features Implemented

### ✅ Landing Page
- Product display with images and descriptions
- Variant selection (size, color)
- Quantity selector
- Dynamic pricing
- Inventory status display

### ✅ Checkout Page
- Comprehensive form validation
- Real-time error feedback
- Dynamic order summary
- Payment simulation logic
- Responsive design

### ✅ Thank You Page
- Order confirmation display
- Customer information review
- Payment status indication
- Email confirmation notification
- Order details from database

### ✅ Backend Features
- RESTful API endpoints
- Database integration
- Order management
- Inventory tracking
- Email notifications
- Transaction processing simulation

### ✅ Additional Features
- TypeScript for type safety
- Responsive design for all devices
- Loading states and error handling
- Modern UI with shadcn/ui components
- Professional email templates

## 🔍 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Fetch all products |
| `/api/products/[id]` | GET | Fetch specific product |
| `/api/orders` | POST | Create new order |
| `/api/orders/[orderNumber]` | GET | Fetch order details |
| `/api/send-email` | POST | Send order emails |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful UI components
- **Vercel** for seamless deployment platform
- **MongoDB** for reliable database service

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**