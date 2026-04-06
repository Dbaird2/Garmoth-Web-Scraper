// AuthCallback.jsx - route at /auth
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      window.dispatchEvent(new Event("storage"));
      navigate("/investments");
    }
  }, []);

  return <p>Signing you in...</p>;
}
