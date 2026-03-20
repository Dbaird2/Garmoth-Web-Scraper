import { Routes, Route } from "react-router-dom";
import ItemPage from "../pages/ItemPage";
import Dashboard from "../pages/DashboardPage"
import About from "../pages/About";
import Navbar from "../components/Navbar"

export default function App() {
  return (
    <div className="dark:bg-[radial-gradient(125%_125%_at_50%_10%,_#000_20%,_#137_650%)] bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/items" element={<ItemPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
