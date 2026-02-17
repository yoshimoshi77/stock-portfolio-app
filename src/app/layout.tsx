"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
    }

    getUser();

    // 🔥 Listen for auth state changes (important)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#fff5f9] to-[#fff9e6]">
        
        {/* Global Header */}
        <header className="w-full bg-white shadow-md px-8 py-4 flex justify-between items-center">

          {/* Left Side Navigation */}
          <div className="flex gap-6 items-center">
            <Link
              href="/dashboard"
              className={`font-medium transition ${
                pathname === "/dashboard" ? "text-pink-500" : "hover:text-pink-400"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/portfolio"
              className={`font-medium transition ${
                pathname === "/portfolio" ? "text-pink-500" : "hover:text-pink-400"
              }`}
            >
              Portfolio
            </Link>

            <Link
              href="/market"
              className={`font-medium transition ${
                pathname === "/market" ? "text-pink-500" : "hover:text-pink-400"
              }`}
            >
              Live Market
            </Link>
          </div>

          {/* Right Side User Info */}
          <div className="flex items-center gap-4">
            {user && (
              <p className="text-sm text-gray-600">
                {user.email}
              </p>
            )}

            {user && (
              <button
                onClick={handleSignOut}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Sign Out
              </button>
            )}
          </div>

        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>

      </body>
    </html>
  );
}
