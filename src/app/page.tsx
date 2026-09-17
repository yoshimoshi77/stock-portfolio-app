import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#fff5f9] to-[#fff9e6]">
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-pink-400 via-pink-300 to-orange-400 bg-clip-text text-transparent mb-10">
            Manage Your Stock Portfolio with Confidence
          </h1>

          <p className="text-xl text-muted-foreground mt-0 mb-8">
            Track your investments, monitor live market prices, and visualize your
            portfolio performance all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                Start Tracking Now
              </Button>
            </Link>

            <Link href="/signin">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Portfolio Tracking
            </h3>

            <p className="text-muted-foreground">
              Track all your stocks with average purchase price, shares owned, and
              real-time profit/loss calculations.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Live Market Prices
            </h3>

            <p className="text-muted-foreground">
              Get real-time stock price updates and make informed decisions based
              on current market conditions.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent-foreground" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Visual Reports
            </h3>

            <p className="text-muted-foreground">
              Visualize your portfolio performance with interactive charts and
              detailed analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}