# StockFolio

StockFolio is a responsive full-stack stock portfolio management application that allows users to manage their investments, track stock holdings, and check live market prices.

**Live Demo:** https://stock-portfolio-app-self.vercel.app

## Features

- User authentication with Supabase
- Personal stock portfolio dashboard
- Add, edit, and remove stock holdings
- Weighted-average purchase price calculations
- Live stock market price lookup
- User-specific portfolio data
- Responsive mobile and desktop design
- Sign-in and sign-out functionality

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI

**Backend & Database**
- Supabase
- PostgreSQL
- Supabase Authentication

**APIs & Deployment**
- REST APIs
- Finnhub Market Data API
- Vercel

**Development**
- Git
- GitHub
- GitHub Copilot

## How It Works

Users can create an account and sign in to access their personal StockFolio dashboard. Each user can add stocks to their portfolio by entering a stock symbol, number of shares, and average purchase price.

When additional shares of an existing stock are added, StockFolio automatically calculates the updated weighted-average purchase price.

The Live Market page allows users to search for stock symbols and retrieve current market price data.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/yoshimoshi77/stock-portfolio-app.git
```

Navigate to the project:

```bash
cd stock-portfolio-app
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the required environment variables.

Start the development server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Author

**Anusha Sharma**

M.S. Information Technology & Management  
The University of Texas at Dallas
