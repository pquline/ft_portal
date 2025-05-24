# ft_stats 📊

A modern web application for visualizing student statistics from the 42 API, including evaluations data.

## ✨ Features

- 🔐 **API Authentication**
  - Secure credential management with localStorage persistence
  - OAuth 2.0 integration with 42 API
  - Easy credential management with forget option

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
- 42 API credentials (client_id and client_secret)

### ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ft_stats.git
cd ft_stats
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
2. Create a new application or use existing credentials
3. Copy your `client_id` and `client_secret`
4. Enter these credentials in the application's API Credentials section

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

1. Enter your 42 API credentials in the "API Credentials" section
2. Click "Authenticate" to authenticate
3. Enter a student's login in the search field
4. View detailed statistics including:
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 42 API for providing the data
- shadcn/ui for the beautiful component library
- Recharts and Chart.js for the visualization capabilities

---

$> made w/ <3 by [pquline](https://github.com/pquline)
