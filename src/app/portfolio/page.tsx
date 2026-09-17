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

  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editShares, setEditShares] = useState("");
  const [editAvgPrice, setEditAvgPrice] = useState("");

  useEffect(() => {
    fetchStocks();
  }, []);

  // Fetch stocks for the currently signed-in user
  async function fetchStocks() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return;
    }

    if (!session) {
      console.error("No user session found");
      return;
    }

    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Fetch stocks error:", error);
      return;
    }

    setStocks(data || []);
  }

  // Add a new stock or update an existing stock
  async function addStock() {
    if (!symbol || !shares || !avgPrice) {
      console.error("Please fill in all fields");
      return;
    }

    const numberOfShares = Number(shares);
    const purchasePrice = Number(avgPrice);

    if (
      !Number.isFinite(numberOfShares) ||
      !Number.isFinite(purchasePrice) ||
      numberOfShares <= 0 ||
      purchasePrice <= 0
    ) {
      console.error("Shares and average price must be positive numbers");
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return;
    }

    if (!session) {
      console.error("No user session found");
      return;
    }

    const upperSymbol = symbol.trim().toUpperCase();

    const { data: existingStocks, error: fetchError } = await supabase
      .from("stocks")
      .select("*")
      .eq("symbol", upperSymbol)
      .eq("user_id", session.user.id);

    if (fetchError) {
      console.error("Existing stock fetch error:", fetchError);
      return;
    }

    // If the stock already exists, update shares and weighted average price
    if (existingStocks && existingStocks.length > 0) {
      const existingStock = existingStocks[0];

      const oldShares = Number(existingStock.shares);
      const oldAvgPrice = Number(existingStock.avg_price);

      const totalShares = oldShares + numberOfShares;

      const newAvgPrice =
        (oldShares * oldAvgPrice + numberOfShares * purchasePrice) /
        totalShares;

      const { error: updateError } = await supabase
        .from("stocks")
        .update({
          shares: totalShares,
          avg_price: newAvgPrice,
        })
        .eq("id", existingStock.id)
        .eq("user_id", session.user.id);

      if (updateError) {
        console.error("Update error:", updateError);
        return;
      }
    } else {
      // Add a brand-new stock
      const { error: insertError } = await supabase
        .from("stocks")
        .insert({
          user_id: session.user.id,
          symbol: upperSymbol,
          shares: numberOfShares,
          avg_price: purchasePrice,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return;
      }
    }

    // Clear input fields
    setSymbol("");
    setShares("");
    setAvgPrice("");

    // Refresh portfolio
    await fetchStocks();

    console.log("Stock saved successfully");
  }

  // Delete a stock
  async function deleteStock(id: string) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return;
    }

    if (!session) {
      console.error("No user session found");
      return;
    }

    const { error } = await supabase
      .from("stocks")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    await fetchStocks();
  }

  // Edit an existing stock
  async function updateStock(id: string) {
    const newShares = Number(editShares);
    const newAvgPrice = Number(editAvgPrice);

    if (
      !Number.isFinite(newShares) ||
      !Number.isFinite(newAvgPrice) ||
      newShares <= 0 ||
      newAvgPrice <= 0
    ) {
      console.error("Shares and average price must be positive numbers");
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return;
    }

    if (!session) {
      console.error("No user session found");
      return;
    }

    const { error } = await supabase
      .from("stocks")
      .update({
        shares: newShares,
        avg_price: newAvgPrice,
      })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Update stock error:", error);
      return;
    }

    setEditingStockId(null);
    setEditShares("");
    setEditAvgPrice("");

    await fetchStocks();
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
              type="number"
              min="0"
              step="any"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Avg Price"
              type="number"
              min="0"
              step="any"
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
                  className="border-b pb-3 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {stock.symbol}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {stock.shares} shares @ $
                        {Number(stock.avg_price).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingStockId(stock.id);
                          setEditShares(stock.shares.toString());
                          setEditAvgPrice(stock.avg_price.toString());
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => deleteStock(stock.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editingStockId === stock.id && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editShares}
                        onChange={(e) => setEditShares(e.target.value)}
                        placeholder="Shares"
                        className="border p-2 rounded"
                      />

                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editAvgPrice}
                        onChange={(e) => setEditAvgPrice(e.target.value)}
                        placeholder="Average Price"
                        className="border p-2 rounded"
                      />

                      <Button onClick={() => updateStock(stock.id)}>
                        Save
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingStockId(null);
                          setEditShares("");
                          setEditAvgPrice("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}