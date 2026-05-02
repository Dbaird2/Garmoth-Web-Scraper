import { Routes, Route, Navigate } from "react-router-dom";
import ItemPage from "../pages/ItemPage";
import Event from "../pages/EventPage";
import EventForm from "../pages/EventForm";
import About from "../pages/About";
import AuthCallback from "../pages/Auth";
import Investments from "../pages/Investments";
import Dashboard from "../pages/Dashboard";
import Landing from "../pages/LandingPage";
import Navbar from "../components/Navbar";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwt");
  return token ? children : <Landing />;
}
const jwt = localStorage.getItem("jwt");

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
      {jwt ? <Navbar /> : <>{/* <Navbar /> */}</>}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Event />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <Investments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthCallback />} />
      </Routes>
    </div>
  );
}
