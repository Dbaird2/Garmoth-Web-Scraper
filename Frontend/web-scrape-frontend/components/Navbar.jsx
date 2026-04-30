import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  Coins,
} from "lucide-react";

export default function Navbar() {
  const [jwt, setJwt] = useState(localStorage.getItem("jwt"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");

  useEffect(() => {
    const handleStorage = () => setJwt(localStorage.getItem("jwt"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/events", label: "Events", icon: CalendarDays },
    { href: "/items", label: "Items", icon: Package },
    { href: "/investments", label: "Investments", icon: TrendingUp },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20">
              <Coins className="w-5 h-5 text-black" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">
                BDO
              </span>
              <span className="text-lg font-light text-teal-400 tracking-tight ml-1">
                Market
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {jwt && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link?.icon;
                const isActive = activeRoute === link?.href;
                return (
                  <Link
                    key={link?.href}
                    to={link?.href}
                    onClick={() => setActiveRoute(link?.href)}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-out
                      ${
                        isActive
                          ? "text-teal-400 bg-teal-400/10"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-teal-400" : ""}`}
                    />
                    <span>{link?.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side - Account */}
          <div className="flex items-center gap-3">
            {jwt ? (
              <div className="flex items-center gap-2">
                {/* Silver Balance Indicator */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs text-gray-400">Live</span>
                </div>

                {/* Account Dropdown */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                  {/* <span className="hidden sm:inline">Account</span> */}
                </button>
              </div>
            ) : (
              <a
                href="https://web-scraper-68z5.onrender.com/auth/google/login"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-150 shadow-lg shadow-white/10"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Sign in with Google
                </span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && jwt && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link?.icon;
              const isActive = activeRoute === link?.href;
              return (
                <Link
                  key={link?.href}
                  to={link?.href}
                  onClick={() => {
                    setActiveRoute(link?.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "text-teal-400 bg-teal-400/10"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link?.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 mt-3 border-t border-white/[0.06]">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all duration-200">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
