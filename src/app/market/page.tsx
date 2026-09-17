"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MarketPage() {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchPrice() {
    if (!symbol) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=d6ac93pr01qqjvbptdhgd6ac93pr01qqjvbptdi0`
      );

      const data = await res.json();
      setPrice(data.c);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f9] to-[#fff9e6] px-3 py-4 sm:p-4 lg:p-8">
      <div className="max-w-xl mx-auto space-y-5 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Live Market</h1>

        <Card className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full">
              <label className="block sm:hidden text-sm font-medium mb-1.5">
                Stock Symbol
              </label>

              <input
                placeholder="Enter Symbol (AAPL)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchPrice();
                  }
                }}
                className="border p-2.5 rounded w-full min-w-0"
              />
            </div>

            <Button
              onClick={fetchPrice}
              disabled={loading}
              className="w-full sm:w-auto sm:self-end"
            >
              {loading ? "Loading..." : "Get Price"}
            </Button>
          </div>

          {price !== null && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Current Price
              </p>

              <p className="text-2xl font-bold mt-1">
                ${Number(price).toFixed(2)}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}