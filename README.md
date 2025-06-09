# ft_portal

A web application for visualizing student data from the 42 API, including evaluations data.

## ✨ Features

- 🔐 **Authentication**
  - Secure 42 OAuth 2.0 integration
  - Single sign-on with your 42 account
  - Automatic session management

- 👤 **Student Statistics**
  - Real-time student search by login
  - Comprehensive evaluation statistics
  - Data visualization with Chart.js and Recharts

- 📝 **Evaluation Analytics**
  - Evaluation quality metrics
  - Feedback length distribution
  - Detailed evaluation statistics

- 🎙️ **Hall Voice**
  - Student's hall voice sound management
  - Audio player integration for sound playback

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A 42 account

### ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/pquline/ft_portal.git
cd ft_portal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

1. Visit [42 API Applications](https://profile.intra.42.fr/oauth/applications)
2. Create a new application
3. Set the redirect URI to `http://localhost:3000/api/auth/callback` for development
4. Copy your `client_id` and `client_secret`
5. Create a `.env` file in the root directory with:
```
FORTYTWO_CLIENT_ID=your_client_id
FORTYTWO_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_URL=http://localhost:3000
JWT_SECRET=your_random_secret_key
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.2 with Turbopack
- **Language:** TypeScript
- **UI Components:**
  - Radix UI primitives
  - Custom shadcn/ui components
  - Tailwind CSS for styling
- **Data Visualization:**
  - Chart.js
  - Recharts
- **State Management:** React Hooks
- **Form Handling:** React Hook Form
- **Notifications:** Sonner
- **Authentication:** 42 OAuth API

## 💡 Usage

1. Click "Sign in" to authenticate with your 42 account
2. Enter a student's login in the search field
3. View detailed statistics including:
   - Evaluation performance
   - Project completion rates
   - Hall voice sound management

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
