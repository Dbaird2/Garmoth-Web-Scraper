import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div
      className="flex justify-end border-b border-white/[0.07] bg-[#0a0e14]/80 backdrop-blur-lg"
      style={{ boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" }}
    >
      <div className="flex font-bold">
        <div className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40">
          <Link
            className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
            to="/"
          >
            Dashboard
          </Link>
        </div>

        <div className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40">
          <Link
            className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
            to="/items"
          >
            Items
          </Link>
        </div>

        <div className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40">
          <Link
            className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
            to="/forms"
          >
            Forms
          </Link>
        </div>

        <div className="p-4 transition-all duration-150 hover:bg-teal-400/[0.06] border-b-2 border-transparent hover:border-teal-400/40">
          <Link
            className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-400 transition-colors duration-150"
            to="/about"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
