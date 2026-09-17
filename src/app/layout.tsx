"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, TrendingUp } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
      setAuthLoading(false);
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setAuthLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Protect logged-in pages
  useEffect(() => {
    if (authLoading) return;

    const protectedPages = ["/dashboard", "/portfolio", "/market", "/reports"];

    const isProtectedPage = protectedPages.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (!user && isProtectedPage) {
      router.replace("/signin");
    }
  }, [user, authLoading, pathname, router]);

  async function handleSignOut() {
    setMenuOpen(false);

    await supabase.auth.signOut();

    router.replace("/signin");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass = (path: string) =>
    `font-medium transition ${
      pathname === path
        ? "text-pink-600"
        : "text-gray-700 hover:text-pink-500"
    }`;

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#fff5f9] to-[#fff9e6]">
        
        {/* Global Header */}
        <header className="relative z-50 w-full bg-white shadow-md">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

            {/* Mobile Logo */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="md:hidden flex items-center gap-2"
              onClick={closeMenu}
            >
              <div className="w-9 h-9 bg-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>

              <span className="text-xl font-bold bg-gradient-to-r from-pink-700 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                StockFolio
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!authLoading && user ? (
              <nav className="hidden md:flex gap-6 items-center">
                <Link
                  href="/dashboard"
                  className={navLinkClass("/dashboard")}
                >
                  Dashboard
                </Link>

                <Link
                  href="/portfolio"
                  className={navLinkClass("/portfolio")}
                >
                  Portfolio
                </Link>

                <Link
                  href="/market"
                  className={navLinkClass("/market")}
                >
                  Live Market
                </Link>
              </nav>
            ) : (
              <div className="hidden md:flex items-center">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                >
                  <div className="w-9 h-9 bg-pink-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>

                  <span className="text-xl font-bold bg-gradient-to-r from-pink-700 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                    StockFolio
                  </span>
                </Link>
              </div>
            )}

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-4">
              {!authLoading && user ? (
                <>
                  <p className="text-sm text-gray-600 max-w-[220px] truncate">
                    {user.email}
                  </p>

                  <button
                    onClick={handleSignOut}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : !authLoading ? (
                <>
                  <Link
                    href="/signin"
                    className="font-medium text-gray-700 hover:text-pink-500 transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition"
                  >
                    Get Started
                  </Link>
                </>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="absolute top-full left-0 right-0 md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pb-4 z-50">
              
              {!authLoading && user ? (
                <>
                  {/* Logged-In Menu */}
                  <nav className="flex flex-col pt-3">
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className={`py-3 ${navLinkClass("/dashboard")}`}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/portfolio"
                      onClick={closeMenu}
                      className={`py-3 ${navLinkClass("/portfolio")}`}
                    >
                      Portfolio
                    </Link>

                    <Link
                      href="/market"
                      onClick={closeMenu}
                      className={`py-3 ${navLinkClass("/market")}`}
                    >
                      Live Market
                    </Link>
                  </nav>

                  <div className="border-t border-gray-100 mt-2 pt-4">
                    <p className="text-sm text-gray-500 mb-3 break-all">
                      {user.email}
                    </p>

                    <button
                      onClick={handleSignOut}
                      className="w-full bg-pink-500 text-white px-4 py-2.5 rounded-lg hover:bg-pink-600 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : !authLoading ? (
                <>
                  {/* Logged-Out Menu */}
                  <nav className="flex flex-col gap-3 pt-4">
                    <Link
                      href="/signin"
                      onClick={closeMenu}
                      className="w-full text-center py-2.5 font-medium text-gray-700 rounded-lg hover:bg-pink-50 transition"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="w-full text-center bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 transition"
                    >
                      Get Started
                    </Link>
                  </nav>
                </>
              ) : null}
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}