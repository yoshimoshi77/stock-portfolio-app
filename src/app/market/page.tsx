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
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f9] to-[#fff9e6] p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Live Market</h1>

        <Card className="p-6 space-y-4">
          <div className="flex gap-4">
            <input
              placeholder="Enter Symbol (AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <Button onClick={fetchPrice}>
              {loading ? "Loading..." : "Get Price"}
            </Button>
          </div>

          {price !== null && (
            <div className="text-xl font-semibold">
              Current Price: ${price}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
