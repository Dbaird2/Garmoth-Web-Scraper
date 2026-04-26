import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [jwt, setJwt] = useState(localStorage.getItem("jwt"));
  useEffect(() => {
    const handleStorage = () => setJwt(localStorage.getItem("jwt"));
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 overflow-auto w-screen border-b border-white/[0.07] bg-[#0a0e14]/80 backdrop-blur-lg"
        style={{ boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" }}
      >
        <div className="">
          <div className="w-fit p-4 transition-all duration-150 border-b-2 border-transparent ">
            {/* {!jwt ? (
              <div className="group">
                <a
                  href="https://web-scraper-68z5.onrender.com/auth/google/login"
                  style={{ textDecoration: "none" }}
                  className=" flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition ease-in group-hover:scale-115 group-hover:animate-bounce active:scale-95"
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
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Sign in with Google
                  </span>
                </a>
              </div>
            ) : ( */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/40 border border-slate-700/50 rounded-md">
              {/* <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2 2 4-4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div> */}
              <button className="hover:cursor-pointer text-teal-400/50">
                Account
              </button>
            </div>
            {/* )} */}
          </div>
        </div>
        <div className="flex justify-center self-center">
          <div className="flex font-bold">
            {jwt && (
              <>
                <div
                  className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40 
              active:scale-95 active:bg-teal-400/20 active:rounded-md active:animate-pulse"
                >
                  <Link
                    className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150 "
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </div>
                <div
                  className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40 
              active:scale-95 active:bg-teal-400/20 active:rounded-md active:animate-pulse"
                >
                  <Link
                    className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150 "
                    to="/events"
                  >
                    Events
                  </Link>
                </div>

                <div
                  className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40 
              active:scale-95 active:bg-teal-400/20 active:rounded-md active:animate-pulse"
                >
                  <Link
                    className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
                    to="/items"
                  >
                    Items
                  </Link>
                </div>
                <div
                  className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40 
                active:scale-95 active:bg-teal-400/20 active:rounded-md active:animate-pulse"
                >
                  <Link
                    className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
                    to="/investments"
                  >
                    Investments
                  </Link>
                </div>

                <div
                  className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40 
            active:scale-95 active:bg-teal-400/20 active:rounded-md active:animate-pulse"
                >
                  <Link
                    className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
                    to="/forms"
                  >
                    Forms
                  </Link>
                </div>
                <div
                  className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40 
              active:scale-95 active:bg-teal-400/20 active:rounded-md active:animate-pulse"
                >
                  <Link
                    className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
                    to="/about"
                  >
                    About
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
