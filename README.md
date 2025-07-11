# ft_portal

A modern web application for visualizing student data from the 42 API, providing comprehensive analytics for evaluations, academic performance, and hall voice data.

## ✨ Features

### 🔐 **Authentication & Security**
- Secure 42 OAuth 2.0 integration with JWT token management
- Automatic session management with 24-hour expiration
- Development mode with mock authentication for testing
- Discord webhook notifications for authentication failures
- Middleware-based route protection
- Secure cookie handling with httpOnly and sameSite policies

### 📊 **Student Analytics Dashboard**
- **Real-time Student Search**: Search by login to access comprehensive student data
- **Evaluation Statistics**: Detailed analysis of peer evaluations as a corrector
  - Total evaluations count and feedback analysis
  - Average rating calculations
  - Project-specific performance metrics
  - Flag distribution (Ok, Outstanding, Failed)
  - Interactive quality metrics with length distribution
- **Academic Performance**: C Piscine exam analysis
  - Exam scores and pass/fail rates
  - Performance evolution tracking
  - Success rate calculations
- **Hall Voice Integration**: Audio playback of student's hall voice sounds
  - In/Out sound categorization
  - Custom audio player component
  - GitHub API integration for sound file access

### 🎨 **User Experience**
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Dark/Light Theme**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Components**: Expandable cards, sortable tables, modal dialogs
- **Loading States**: Comprehensive loading indicators and error handling
- **Toast Notifications**: User feedback with Sonner toast system

### 🔍 **SEO & Performance**
- **Progressive Web App (PWA)**: Installable with service worker
- **SEO Optimization**: Comprehensive meta tags, Open Graph, and Twitter cards
- **Structured Data**: JSON-LD schema markup for search engines
- **Dynamic Sitemap**: Auto-generated sitemap.xml
- **Performance**: Next.js 15 with Turbopack for fast development
- **Image Optimization**: Next.js Image component with CDN support

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: Radix UI primitives + shadcn/ui
- **State Management**: React Hooks with useState/useEffect
- **Data Visualization**: Chart.js 4 + Recharts 2
- **Forms**: React Hook Form with Zod validation

### **Backend & API**
- **API Routes**: Next.js API routes with TypeScript
- **Authentication**: 42 OAuth 2.0 with JWT tokens
- **Data Fetching**: Custom API client with retry logic and rate limiting
- **Error Handling**: Comprehensive error boundaries and Discord notifications

### **Development & Deployment**
- **Development**: Turbopack for fast refresh
- **Linting**: ESLint with Next.js configuration
- **Type Safety**: Full TypeScript coverage
- **Environment**: Development/production mode switching

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A 42 account for API access
- Discord webhook URL (optional, for error monitoring)

### ⚙️ Installation

1. **Clone the repository**:
```bash
git clone https://github.com/pquline/ft_portal.git
cd ft_portal
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory:
```env
# 42 API Configuration
FORTYTWO_CLIENT_ID=your_client_id
FORTYTWO_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_URL=http://localhost:3000

# Security
JWT_SECRET=your_random_secret_key

# Optional: Error Monitoring
DISCORD_WEBHOOK_URL_ERROR=your_discord_webhook_url
```

4. **Configure 42 API Application**:
   - Visit [42 API Applications](https://profile.intra.42.fr/oauth/applications)
   - Create a new application
   - Set redirect URI to `http://localhost:3000/api/auth/callback`
   - Copy the client ID and secret to your `.env` file

5. **Start development server**:
```bash
npm run dev
```

6. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### 🔧 Development Mode

The application includes a comprehensive development mode that:
- Provides mock authentication without requiring 42 API credentials
- Returns realistic mock data for all API endpoints
- Simulates loading states and network delays
- Allows full feature testing without production dependencies

## 📁 Project Structure

```
ft_portal/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main application routes
│   │   ├── page.tsx             # Home dashboard
│   │   ├── about/               # About page
│   │   ├── privacy/             # Privacy policy
│   │   └── terms/               # Terms of use
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── students/            # Student data endpoints
│   │   ├── evaluations/         # Evaluation data
│   │   ├── hall-voice/          # Hall voice integration
│   │   └── user/                # User profile data
│   ├── auth/                    # Authentication page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── EvaluationsCard.tsx      # Evaluation analytics
│   ├── AcademicPerformanceCard.tsx # Academic metrics
│   ├── HallVoiceCard.tsx        # Hall voice player
│   └── EvaluationQualityMetrics.tsx # Quality analysis
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client functions
│   ├── auth.ts                  # Authentication utilities
│   └── utils.ts                 # General utilities
├── middleware.ts                # Route protection
├── types/                       # TypeScript definitions
└── public/                      # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Features

- **JWT Token Management**: Secure session handling with 24-hour expiration
- **Route Protection**: Middleware-based authentication checks
- **Secure Cookies**: HttpOnly cookies with proper domain settings
- **Rate Limiting**: Built-in API rate limiting and retry logic
- **Error Monitoring**: Discord webhook integration for production errors
- **Environment Isolation**: Separate development and production configurations

## 📊 Data Sources

- **42 API**: Student profiles, evaluations, and academic data
- **GitHub API**: Hall voice sound files from 42paris/hall-voice repository
- **Local Processing**: Statistical calculations and data aggregation

## 🎯 Key Components

### **Evaluation Analytics**
- Comprehensive evaluation statistics with filtering and sorting
- Quality metrics based on feedback length and ratings
- Interactive charts and progress indicators
- Detailed modal views for specific data subsets

### **Academic Performance**
- C Piscine exam analysis with pass/fail tracking
- Performance evolution visualization
- Success rate calculations and trends

### **Hall Voice Integration**
- Audio file discovery via GitHub API
- Custom audio player with play/pause controls
- Sound categorization (in/out sounds)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [https://portal.pfischof.com](https://portal.pfischof.com)
- **GitHub Repository**: [https://github.com/pquline/ft_portal](https://github.com/pquline/ft_portal)
- **42 API Documentation**: [https://api.intra.42.fr/apidoc](https://api.intra.42.fr/apidoc)

---

Built with ❤️ for the 42 community
