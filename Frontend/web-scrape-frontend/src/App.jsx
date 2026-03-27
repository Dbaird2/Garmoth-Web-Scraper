import { Routes, Route } from "react-router-dom";
import ItemPage from "../pages/ItemPage";
import Dashboard from "../pages/DashboardPage"
import About from "../pages/About";
import Navbar from "../components/Navbar"

export default function App() {
  return (
    <div
      className="dark:bg-[#090e14] bg-white h-full"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/items" element={<ItemPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
