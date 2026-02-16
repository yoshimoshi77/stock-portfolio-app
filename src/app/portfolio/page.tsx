"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PortfolioPage() {
  const supabase = createClient();

  const [stocks, setStocks] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");

  useEffect(() => {
    fetchStocks();
  }, []);

  async function fetchStocks() {
    const { data } = await supabase.from("stocks").select("*");
    if (data) setStocks(data);
  }

  async function addStock() {
    if (!symbol || !shares || !avgPrice) return;
  
    const { data: { session } } = await supabase.auth.getSession();
    const upperSymbol = symbol.trim().toUpperCase();
  
    const { data: existingStocks, error: fetchError } = await supabase
      .from("stocks")
      .select("*")
      .eq("symbol", upperSymbol)
      .eq("user_id", session?.user.id);
  
    console.log("Existing:", existingStocks);
    console.log("Fetch error:", fetchError);
  
    if (existingStocks && existingStocks.length > 0) {
      const existingStock = existingStocks[0];
  
      const totalShares = existingStock.shares + Number(shares);

const newAvgPrice =
  (
    existingStock.shares * existingStock.avg_price +
    Number(shares) * Number(avgPrice)
  ) / totalShares;

const { error: updateError } = await supabase
  .from("stocks")
  .update({
    shares: totalShares,
    avg_price: newAvgPrice,
  })
  .eq("id", existingStock.id);

      console.log("Update error:", updateError);
  
    } else {
      const { error: insertError } = await supabase
        .from("stocks")
        .insert({
          user_id: session?.user.id,
          symbol: upperSymbol,
          shares: Number(shares),
          avg_price: Number(avgPrice),
        });
  
      console.log("Insert error:", insertError);
    }
  
    fetchStocks();
  }
  
  
  async function deleteStock(id: string) {
    await supabase.from("stocks").delete().eq("id", id);
    fetchStocks();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f9] to-[#fff9e6] p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">My Portfolio</h1>

        {/* Add Stock */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Add Stock</h2>

          <div className="flex gap-4">
            <input
              placeholder="Symbol (AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              placeholder="Shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              placeholder="Avg Price"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <Button type="button" onClick={addStock}>
                Add
              </Button>
          </div>
        </Card>

        {/* Holdings */}
        <Card className="p-6">
          {stocks.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Your portfolio is empty
            </p>
          ) : (
            <div className="space-y-4">
              {stocks.map((stock) => (
                <div
                  key={stock.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <div className="font-semibold">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stock.shares} shares @ ${stock.avg_price}
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => deleteStock(stock.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
