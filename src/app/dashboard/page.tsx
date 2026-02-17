"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/signin");
      return;
    }

    setUser(session.user);

    const { data } = await supabase
      .from("stocks")
      .select("*")
      .eq("user_id", session.user.id);

    setStocks(data || []);
    setLoading(false);
  }

  const calculateTotals = () => {
    if (!stocks || stocks.length === 0) {
      return { totalValue: 0, totalPL: 0, totalPLPercent: 0, totalStocks: 0 };
    }

    const totalValue = stocks.reduce((sum, stock) => {
      return sum + stock.avg_price * stock.shares;
    }, 0);

    const totalCost = stocks.reduce((sum, stock) => {
      return sum + stock.avg_price * stock.shares;
    }, 0);

    const totalPL = totalValue - totalCost;
    const totalPLPercent =
      totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    return {
      totalValue,
      totalPL,
      totalPLPercent,
      totalStocks: stocks.length,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const { totalValue, totalPL, totalPLPercent, totalStocks } =
    calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f9] to-[#fff9e6] p-8">
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Value */}
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">
                Total Value
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Total P/L */}
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">
                Total P/L
              </CardTitle>
              {totalPL >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  totalPL >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ${totalPL.toFixed(2)}
              </div>
              <p
                className={`text-xs ${
                  totalPL >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {totalPLPercent.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          {/* Total Stocks */}
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">
                Total Stocks
              </CardTitle>
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStocks}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-pink-200 to-orange-200 border-pink-300">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => router.push("/portfolio")}
                className="w-full bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition"
              >
                View Portfolio
              </button>
              <button
                onClick={() => router.push("/market")}
                className="w-full bg-orange-300 text-white py-2 px-4 rounded-md hover:bg-orange-400 transition"
              >
                Live Market
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stocks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            {stocks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No stocks in your portfolio yet.
              </div>
            ) : (
              <div className="space-y-4">
                {stocks.slice(0, 5).map((stock) => (
                  <div
                    key={stock.id}
                    className="flex justify-between items-center p-4 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stock.shares} shares @ $
                        {stock.avg_price}
                      </div>
                    </div>
                    <div className="font-semibold">
                      $
                      {(
                        stock.avg_price *
                        stock.shares
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
