# ft_portal

<div align="center">

![ft_portal](https://img.shields.io/badge/ft_portal-42%20Analytics%20Platform-blue?style=for-the-badge&logo=42)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, comprehensive analytics platform for visualizing student data from the 42 API**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Online-green?style=for-the-badge&logo=vercel)](https://portal.pfischof.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/pquline/ft_portal)

*Empowering the 42 community with advanced student analytics and performance insights*

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🛠️ Development](#️-development)
- [🔒 Security](#-security)
- [📊 Data Sources](#-data-sources)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🔐 **Enterprise-Grade Authentication**
- **Secure OAuth 2.0 Integration** with 42 API
- **JWT Token Management** with automatic session handling
- **Middleware-Based Route Protection** for enhanced security
- **Development Mode** with comprehensive mock data for testing
- **Discord Webhook Integration** for real-time error monitoring
- **Secure Cookie Handling** with httpOnly and sameSite policies

### 📊 **Advanced Analytics Dashboard**
- **Real-Time Student Search** with instant data retrieval
- **Comprehensive Evaluation Analytics**
  - Peer evaluation statistics and performance metrics
  - Interactive quality metrics with length distribution analysis
  - Project-specific performance tracking
  - Flag distribution visualization (Ok, Outstanding, Failed)
- **Academic Performance Tracking**
  - C Piscine exam analysis with detailed scoring
  - Performance evolution and trend analysis
  - Success rate calculations and predictive insights
- **Hall Voice Integration**
  - Audio playback with custom player interface
  - Sound categorization (in/out sounds)
  - GitHub API integration for seamless file access

### 🎨 **Premium User Experience**
- **Modern Design System** built with shadcn/ui components
- **Adaptive Theme System** with dark/light mode support
- **Responsive Architecture** optimized for all devices
- **Interactive Components** with expandable cards and modal dialogs
- **Professional Loading States** with comprehensive error handling
- **Toast Notification System** for enhanced user feedback

### ⚡ **Performance & SEO**
- **Progressive Web App (PWA)** with offline capabilities
- **Advanced SEO Optimization** with structured data markup
- **Dynamic Sitemap Generation** for search engine visibility
- **Next.js 15 with Turbopack** for lightning-fast development
- **Image Optimization** with CDN support and lazy loading

---

## 🏗️ Architecture

### **Frontend Technology Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.2 | Full-stack React framework with App Router |
| **TypeScript** | 5.0 | Type-safe development with full coverage |
| **Tailwind CSS** | 4.0 | Utility-first CSS framework |
| **Radix UI** | Latest | Accessible component primitives |
| **shadcn/ui** | Latest | Modern component library |
| **React Hook Form** | 7.56.4 | Performant form handling |
| **Zod** | 3.24.4 | Schema validation and type inference |

### **Data Visualization & State Management**

| Library | Version | Purpose |
|---------|---------|---------|
| **Chart.js** | 4.4.9 | Interactive chart rendering |
| **Recharts** | 2.15.3 | Advanced data visualization |
| **React Hooks** | Built-in | State management and side effects |
| **Sonner** | 2.0.3 | Toast notification system |

### **Backend & API Infrastructure**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Routes** | Next.js API | Serverless backend endpoints |
| **Authentication** | 42 OAuth 2.0 | Secure user authentication |
| **Data Fetching** | Custom Client | Retry logic and rate limiting |
| **Error Handling** | Discord Webhooks | Production error monitoring |

---

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **42 Account** for API access
- **Discord Webhook** (optional, for error monitoring)

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pquline/ft_portal.git
   cd ft_portal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:
   ```env
   # 42 API Configuration
   FORTYTWO_CLIENT_ID=your_client_id
   FORTYTWO_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_URL=http://localhost:3000

   # Security Configuration
   JWT_SECRET=your_random_secret_key

   # Optional: Error Monitoring
   DISCORD_WEBHOOK_URL_ERROR=your_discord_webhook_url
   ```

4. **42 API Application Setup**

   - Navigate to [42 API Applications](https://profile.intra.42.fr/oauth/applications)
   - Create a new application
   - Set redirect URI to `http://localhost:3000/api/auth/callback`
   - Copy credentials to your `.env` file

5. **Launch Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### **Development Mode Features**

The application includes a comprehensive development mode that provides:
- ✅ **Mock Authentication** without requiring 42 API credentials
- ✅ **Realistic Mock Data** for all API endpoints
- ✅ **Simulated Loading States** and network delays
- ✅ **Full Feature Testing** without production dependencies

---

## 📁 Project Structure

```
ft_portal/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (main)/                   # Main application routes
│   │   ├── 📄 page.tsx             # Home dashboard
│   │   ├── 📁 about/               # About page
│   │   ├── 📁 privacy/             # Privacy policy
│   │   └── 📁 terms/               # Terms of use
│   ├── 📁 api/                     # API routes
│   │   ├── 📁 auth/                # Authentication endpoints
│   │   ├── 📁 students/            # Student data endpoints
│   │   ├── 📁 evaluations/         # Evaluation data
│   │   ├── 📁 hall-voice/          # Hall voice integration
│   │   └── 📁 user/                # User profile data
│   ├── 📁 auth/                    # Authentication page
│   └── 📄 layout.tsx               # Root layout
├── 📁 components/                   # React components
│   ├── 📁 ui/                      # shadcn/ui components
│   ├── 📄 EvaluationsCard.tsx      # Evaluation analytics
│   ├── 📄 AcademicPerformanceCard.tsx # Academic metrics
│   ├── 📄 HallVoiceCard.tsx        # Hall voice player
│   └── 📄 EvaluationQualityMetrics.tsx # Quality analysis
├── 📁 lib/                         # Utility libraries
│   ├── 📄 api.ts                   # API client functions
│   ├── 📄 auth.ts                  # Authentication utilities
│   └── 📄 utils.ts                 # General utilities
├── 📄 middleware.ts                # Route protection
├── 📁 types/                       # TypeScript definitions
└── 📁 public/                      # Static assets
```

---

## 🛠️ Development

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

### **Development Workflow**

1. **Feature Development**
   - Create feature branch from `main`
   - Implement changes with TypeScript
   - Test with development mode
   - Submit pull request

2. **Code Quality**
   - ESLint configuration for consistency
   - TypeScript for type safety
   - Conventional commit messages

3. **Testing Strategy**
   - Development mode for feature testing
   - Mock data for isolated testing
   - Production-like environment simulation

---

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Token Management** with 24-hour expiration
- **Secure Session Handling** with automatic refresh
- **Route Protection** via Next.js middleware
- **OAuth 2.0 Flow** with 42 API integration

### **Data Protection**
- **HttpOnly Cookies** with secure domain settings
- **SameSite Policy** for CSRF protection
- **Environment Isolation** between dev/prod
- **Rate Limiting** with exponential backoff

### **Error Monitoring**
- **Discord Webhook Integration** for production errors
- **Comprehensive Error Boundaries** for graceful failures
- **Logging and Analytics** for debugging

---

## 📊 Data Sources

### **Primary APIs**
- **42 API** - Student profiles, evaluations, and academic data
- **GitHub API** - Hall voice sound files from 42paris/hall-voice repository

### **Data Processing**
- **Local Statistical Calculations** for performance metrics
- **Real-time Data Aggregation** for analytics
- **Caching Strategy** for optimal performance

---

## 🎯 Key Components

### **Evaluation Analytics Engine**
- **Comprehensive Statistics** with advanced filtering and sorting
- **Quality Metrics Analysis** based on feedback length and ratings
- **Interactive Visualizations** with Chart.js and Recharts
- **Detailed Modal Views** for granular data exploration

### **Academic Performance Tracker**
- **C Piscine Exam Analysis** with detailed pass/fail tracking
- **Performance Evolution Visualization** with trend analysis
- **Success Rate Calculations** with predictive insights

### **Hall Voice Integration System**
- **Audio File Discovery** via GitHub API integration
- **Custom Audio Player** with advanced playback controls
- **Sound Categorization** for in/out sound management

---

## 🤝 Contributing

We welcome contributions from the 42 community! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Contribution Guidelines**
- Follow TypeScript best practices
- Maintain code quality with ESLint
- Write meaningful commit messages
- Test thoroughly in development mode
- Update documentation as needed

### **Development Standards**
- **Code Style**: ESLint + Prettier configuration
- **Type Safety**: Full TypeScript coverage
- **Testing**: Development mode validation
- **Documentation**: Clear and comprehensive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Online-green?style=for-the-badge&logo=vercel)](https://portal.pfischof.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/pquline/ft_portal)
[![42 API](https://img.shields.io/badge/42%20API-Documentation-blue?style=for-the-badge)](https://api.intra.42.fr/apidoc)

</div>

---

<div align="center">

**Built with ❤️ for the 42 community**

*Empowering students with data-driven insights*

</div>
