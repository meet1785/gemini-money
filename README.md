# FinanceGPT - AI-Powered Personal Finance Management

A **production-ready** comprehensive personal finance management application powered by Google's Gemini AI, offering real-time financial insights, expense tracking, investment planning, and personalized advice.

## 🚀 Features

### ✅ Core Features
- **Real-time Dashboard** - Live portfolio updates and financial health monitoring
- **AI Financial Chat** - Intelligent conversational finance advisor with retry logic and rate limiting
- **Smart Expense Tracker** - Automatic categorization with AI analysis
- **Budget Planner** - Set spending limits and track progress by category
- **Recurring Transactions** - Automate tracking of regular expenses and income (rent, salary, subscriptions)
- **Goal Setting & Tracking** - Monitor progress toward financial objectives
- **Portfolio Management** - Real-time investment tracking with simulated updates
- **Investment Calculator** - Plan and simulate investment strategies
- **Educational Hub** - Learn financial concepts
- **Data Management** - Export, import, and manage your financial data

### 🤖 AI-Powered Capabilities
- **Personalized Financial Advice** - Context-aware recommendations
- **Expense Analysis** - AI insights into spending patterns
- **Investment Strategy Planning** - Tailored portfolio suggestions
- **Real-time Data Processing** - Dynamic updates and trend analysis
- **Fallback Mode** - Works without API key with pre-built responses
- **Retry Logic** - Automatic retry with exponential backoff for failed API calls
- **Rate Limiting** - Prevents API quota exhaustion (1 second minimum between requests)

### 🔒 Production-Ready Features
- **Data Persistence** - All data automatically saved to browser localStorage
- **Data Export/Import** - Backup and restore your financial data as JSON
- **Error Boundaries** - Graceful error handling with recovery options
- **Input Validation** - Comprehensive validation for all user inputs
- **TypeScript** - Full type safety throughout the application
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Error Recovery** - Automatic retry logic for API failures

## 🛠️ Quick Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd gemini-money
npm install
```

### 2. Configure Gemini AI (Required for full functionality)

#### Get Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free API key (no credit card required)
3. Copy your API key

#### Setup Environment Variables
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
VITE_APP_NAME=FinanceGPT
VITE_APP_VERSION=1.0.0
```

### 3. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📊 Real-time Features

### Portfolio Tracking
- **Live Updates**: Portfolio values update every 30 seconds
- **Performance Metrics**: Real-time returns and percentage changes
- **Connection Status**: Visual indicators for data connectivity

### AI Analysis
- **Dynamic Insights**: Expense patterns analyzed in real-time
- **Smart Recommendations**: AI-powered financial advice
- **Trend Analysis**: Spending behavior insights

### Data Synchronization
- **Auto-refresh**: Financial data refreshes automatically
- **Offline Support**: Cached data available during disconnection
- **Progress Tracking**: Goal progress updates in real-time

## 🔧 Configuration Options

### With Gemini API Key
- ✅ Real-time AI financial advice
- ✅ Personalized investment strategies  
- ✅ Advanced expense analysis
- ✅ Custom financial planning
- ✅ Context-aware recommendations

### Without API Key (Fallback Mode)
- ✅ Basic pre-written responses
- ✅ General financial tips
- ✅ Standard dashboard features
- ⚠️ Limited personalization

## 🏗️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Deploy to GitHub Pages

1. Ensure the repository is named `gemini-money` (or adjust `base` in `vite.config.ts`).
2. Add your Gemini key as a repository secret named `VITE_GEMINI_API_KEY` (Settings > Secrets and variables > Actions > New repository secret).
3. Push to `main`. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will build and publish the site to GitHub Pages.
4. Enable Pages: Settings > Pages > Build and deployment > Source: GitHub Actions.
5. Access at: `https://<your-username>.github.io/gemini-money/`

If you fork under a different repo name, update the `base` option in `vite.config.ts` to match: `base: '/your-repo-name/'`.

### Preview Production Build
```bash
npm run preview
```

## 🔍 Linting
```bash
npm run lint
```

## 📱 Usage Guide

### 1. Dashboard Overview
- View your financial health score
- Monitor real-time portfolio performance
- Track expense categories and trends
- View connection status indicator

### 2. AI Financial Chat
- Ask questions in natural language
- Get personalized financial advice
- Use quick question buttons for common queries
- Automatic retry on API failures

### 3. Expense Tracking
- Add expenses manually
- Upload bank statements for AI categorization (demo)
- View AI-powered spending insights
- Track expenses by category

### 4. Budget Planning
- Set spending limits for different categories
- Track budget usage in real-time
- Get alerts when approaching limits
- Monitor monthly and yearly budgets

### 5. Recurring Transactions (NEW)
- **Automate Regular Expenses**: Set up rent, subscriptions, utilities to auto-track
- **Income Management**: Schedule recurring income like salary deposits
- **Flexible Frequencies**: Support for daily, weekly, monthly, and yearly schedules
- **Pause/Resume**: Temporarily pause transactions without deleting them
- **End Dates**: Set optional end dates for time-limited transactions
- **Summary Stats**: View total monthly commitments and income sources

### 6. Goal Management  
- Set financial goals with target amounts
- Track progress automatically
- Add funds to goals incrementally
- Get AI recommendations for achieving goals

### 7. Portfolio Tracking
- Monitor investment performance in real-time
- View returns and allocation
- Add new investments
- Track portfolio value changes

### 8. Data Management
- **Export Data**: Download all your financial data as JSON backup
- **Import Data**: Restore from a previous backup
- **Clear Data**: Reset all stored data (with confirmation)
- **Local Storage**: All data stored securely in your browser

## 🔐 Security & Privacy

- **API Key Storage**: Stored locally in environment variables
- **No Data Sharing**: Your financial data stays private
- **Secure Processing**: All AI processing respects user privacy
- **Local First**: Core features work offline
- **Data Persistence**: Automatic localStorage backup
- **Input Validation**: Comprehensive validation and sanitization
- **Error Boundaries**: Graceful error handling prevents data loss
- **Rate Limiting**: Prevents API abuse and quota exhaustion

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google Gemini API
- **State Management**: React Context API
- **Data Persistence**: Browser localStorage
- **Build Tool**: Vite
- **Animations**: Framer Motion

### Key Components
- **Error Boundary**: Catches and handles runtime errors
- **Data Persistence Layer**: Automatic localStorage sync
- **API Service**: Rate-limited Gemini AI integration with retry logic
- **Validation Layer**: Input sanitization and validation utilities

## 🆘 Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env`
- Restart the development server after adding the key
- Check the API Key Setup section in the app for status

### Connection Issues
- The app shows connection status in the dashboard
- Cached data is used when offline
- Real-time updates resume when connection is restored

### Data Management
- **Backup Regularly**: Use the Export feature to backup your data
- **Before Clearing**: Always export data before using the clear function
- **Import**: Can restore data from any previous export file
- **localStorage Limit**: Browser localStorage has a ~5-10MB limit per domain

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed
- Check that all environment variables are properly set

## 💾 Data Storage

All your financial data is stored locally in your browser using localStorage:

- **Automatic Saving**: Data is automatically saved when you add/edit/delete items
- **Persistent**: Data survives page refreshes and browser restarts
- **Private**: Data never leaves your browser
- **Backup Options**: Export feature for external backups
- **No Server**: No database or server required

### Data Stored:
- Expenses (including auto-generated recurring transactions)
- Recurring Transactions (schedules and settings)
- Budgets
- Goals
- Investments
- Settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Getting Started

1. **Add Your API Key** - Follow the setup instructions above
2. **Explore Features** - Navigate through all sections
3. **Add Your Data** - Input your expenses, goals, and budgets
4. **Set Budgets** - Create spending limits for categories
5. **Configure Recurring Transactions** - Set up your regular expenses and income
6. **Monitor Progress** - Watch real-time updates
7. **Chat with AI** - Ask financial questions
8. **Export Data** - Create regular backups
6. **Chat with AI** - Ask financial questions
7. **Export Data** - Create regular backups

---

**Ready to use!** Just add your Gemini API key and start managing your finances with AI assistance! 🚀

---

## Original Lovable Project Information

**URL**: https://lovable.dev/projects/66ec7195-c108-4ebf-9ae7-58832866dfcd

### Technologies Used
- Vite
- TypeScript  
- React
- shadcn-ui
- Tailwind CSS
- Google Gemini AI
