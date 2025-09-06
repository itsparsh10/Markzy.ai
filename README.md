# 🚀 Markzy - AI-Powered Marketing Content Platform

<div align="center">

![Markzy Logo](public/assets/images/logo.png)

**Transform Your Marketing with 100+ AI-Powered Content Generation Tools**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.17.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-18.3.0-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-46adb6?style=for-the-badge&logo=vercel)](https://markzy.vercel.app)
[![Documentation](https://img.shields.io/badge/Documentation-1d1f89?style=for-the-badge&logo=gitbook)](https://docs.markzy.com)
[![Support](https://img.shields.io/badge/Support-24/7-green?style=for-the-badge&logo=discord)](https://discord.gg/markzy)

</div>

---

## ✨ Overview

**Markzy** is a comprehensive AI-powered marketing platform that revolutionizes content creation for businesses, marketers, and entrepreneurs. With over **100 specialized AI tools**, Markzy generates high-converting marketing content across all channels - from social media posts to email campaigns, sales pages to blog articles.

### 🎯 Key Features

- **🤖 100+ AI Marketing Tools** - Complete suite of content generation tools
- **⚡ Real-time Generation** - Instant, high-quality content creation
- **🎨 Multi-Platform Support** - Facebook, Instagram, LinkedIn, TikTok, YouTube, and more
- **📊 Advanced Analytics** - Track performance and optimize content
- **👥 Team Collaboration** - Work together on campaigns seamlessly
- **🔒 Enterprise Security** - Bank-level encryption and data protection
- **💳 Flexible Pricing** - Free tier + Pro plans with 14-day free trial

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Radix UI, Lucide React
- **Animations**: Framer Motion, GSAP
- **Icons**: FontAwesome, Tabler Icons

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB 6.17.0 with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Payment Processing**: Stripe 18.3.0
- **File Storage**: MongoDB GridFS

### AI & Services
- **AI Integration**: Custom AI service endpoints
- **Content Processing**: Advanced text analysis and generation
- **Export Options**: PDF, Word, and multiple formats
- **Caching**: Redis for performance optimization

### Development Tools
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- MongoDB database
- Stripe account (for payments)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/markzy.git
   cd markzy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NEXT_PUBLIC_API_URL=your_api_base_url
   ```

4. **Database Setup**
   ```bash
   npm run db:init
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
markzy/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── admin/               # Admin dashboard APIs
│   │   ├── auth/                # Authentication APIs
│   │   ├── user/                # User management APIs
│   │   └── webhooks/            # Webhook handlers
│   ├── components/              # React Components
│   │   ├── landing-page/        # Landing page sections
│   │   ├── ui/                  # Reusable UI components
│   │   └── [157+ tool components] # AI tool components
│   ├── dashboard/               # User dashboard
│   ├── admin_dashboard/         # Admin panel
│   └── [feature pages]/        # Feature-specific pages
├── services/                     # Backend services
│   ├── models/                  # Database models
│   ├── aiTools.js              # AI service integration
│   ├── paymentService.js       # Payment processing
│   └── user.js                 # User management
├── public/                      # Static assets
├── db_utils/                    # Database utilities
└── scripts/                     # Utility scripts
```

---

## 🎨 AI Tools Categories

### 📝 Content Creation
- **Blog Generator** - SEO-optimized articles and outlines
- **Content Repurposer** - Transform content across platforms
- **Story-Based Posts** - Emotional storytelling content
- **Content Pillars** - Define brand content themes
- **Content Ideas** - Generate FAQs and topic clusters
- **Content Outline** - Structure blogs, videos, podcasts

### 📱 Social Media
- **Instagram Captions** - Engaging posts with CTAs
- **Carousel Content** - Multi-slide educational posts
- **Reels Scripts** - Short-form video content
- **30-Day Social Plan** - Complete monthly strategy
- **TikTok Scripts** - Viral short-form content
- **LinkedIn Posts** - Professional networking content

### 📧 Email Marketing
- **Welcome Sequences** - Onboarding email campaigns
- **Newsletter Templates** - Professional email layouts
- **Sales Emails** - High-converting promotional content
- **Abandoned Cart** - Recovery email sequences
- **Subject Line Generator** - Compelling email subjects

### 🛒 E-commerce
- **Product Descriptions** - Conversion-optimized copy
- **Amazon Listings** - Keyword-optimized marketplace content
- **Sales Pages** - Long-form persuasive landing pages
- **Upsell Copy** - Increase average order value
- **Review Responses** - Professional customer service

### 🔍 SEO & Website
- **Keyword Research** - Strategic keyword clusters
- **Meta Descriptions** - SEO-optimized metadata
- **Homepage Copy** - Conversion-focused content
- **About Page Copy** - Compelling brand stories
- **FAQ Generation** - Comprehensive support content

### 🎥 Video & Audio
- **YouTube Scripts** - Hook-heavy video content
- **Podcast Scripts** - Engaging audio content
- **Video Ideas** - Creative content concepts
- **Transcript Processing** - Convert audio to text

### 💼 Sales & CRM
- **Sales Scripts** - Persuasive call scripts
- **Proposal Templates** - Professional business proposals
- **Follow-up Sequences** - Lead nurturing campaigns
- **Objection Handlers** - Common objection responses

---

## 🔧 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/check        # Verify authentication
```

### User Management
```http
GET  /api/user/profile      # Get user profile
PUT  /api/user/profile      # Update user profile
GET  /api/user/activities   # User activity history
GET  /api/user/brands       # User brands
GET  /api/user/products     # User products
```

### AI Tools
```http
POST /api/form-query        # Submit AI tool requests
GET  /api/save-history      # Get content history
POST /api/save-history      # Save generated content
```

### Payment Processing
```http
POST /api/create-checkout-session  # Create Stripe session
POST /api/verify-payment           # Verify payment
POST /api/webhooks/stripe          # Stripe webhooks
```

### Admin Dashboard
```http
GET  /api/admin/stats       # Platform statistics
GET  /api/admin/users       # User management
GET  /api/admin/support     # Support tickets
GET  /api/admin/payments    # Payment analytics
```

---

## 💳 Pricing Plans

### 🆓 Free Plan
- 5 AI-generated contents per month
- 3 marketing tools access
- Basic templates
- Community support
- Export to PDF/Word

### ⭐ Pro Plan - $19.99/month
- **Unlimited** AI-generated content
- **All 100+** marketing tools
- Premium templates
- Priority email support
- Advanced analytics
- Team collaboration (5 members)
- Custom branding
- API access
- **14-day FREE trial**

### 🏢 Enterprise Plan - $199/month
- Everything in Pro
- Unlimited team members
- White-label solutions
- Dedicated account manager
- 24/7 phone support
- Custom integrations
- Advanced reporting
- SLA guarantee

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build the Docker image
docker build -t markzy .

# Run the container
docker run -p 3000:3000 markzy
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write comprehensive tests
- Document your code

---

## 📊 Performance

- **⚡ Fast Loading**: Optimized with Next.js 15 and modern bundling
- **📱 Mobile First**: Responsive design for all devices
- **🔍 SEO Optimized**: Built-in SEO features and meta tags
- **♿ Accessible**: WCAG 2.1 compliant components
- **🌐 Global CDN**: Fast content delivery worldwide

---

## 🔒 Security

- **🔐 JWT Authentication** - Secure user sessions
- **🛡️ Data Encryption** - AES-256 encryption at rest
- **🔒 HTTPS Only** - All communications encrypted
- **🛡️ Input Validation** - Comprehensive data sanitization
- **🔐 Rate Limiting** - API abuse prevention
- **🛡️ CORS Protection** - Cross-origin request security

---

## 📈 Analytics & Monitoring

- **📊 User Analytics** - Track user engagement and tool usage
- **📈 Performance Metrics** - Monitor application performance
- **🔍 Error Tracking** - Comprehensive error logging
- **📱 Real-time Monitoring** - Live application health checks

---

## 🆘 Support

### Documentation
- [User Guide](https://docs.markzy.com/user-guide)
- [API Reference](https://docs.markzy.com/api)
- [Troubleshooting](https://docs.markzy.com/troubleshooting)

### Community
- [Discord Server](https://discord.gg/markzy)
- [GitHub Discussions](https://github.com/yourusername/markzy/discussions)
- [Community Forum](https://community.markzy.com)

### Contact
- **Email**: support@markzy.com
- **Live Chat**: Available in the app
- **Response Time**: < 2 hours for Pro users

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT models powering our AI tools
- **Vercel** for hosting and deployment platform
- **MongoDB** for database services
- **Stripe** for payment processing
- **Tailwind CSS** for the amazing styling framework
- **Next.js Team** for the incredible React framework

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/markzy&type=Date)](https://star-history.com/#yourusername/markzy&Date)

---

<div align="center">

**Made with ❤️ by the Markzy Team**

[Website](https://markzy.com) • [Documentation](https://docs.markzy.com) • [Support](https://support.markzy.com) • [Blog](https://blog.markzy.com)

</div>
