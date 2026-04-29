import { useState, useEffect } from "react";

export function useWebsocket(onMessage) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ws = new WebSocket(`wss://web-scraper-68z5.onrender.com/communicate`);
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    // Handler is attached synchronously, before any messages can arrive
    ws.onmessage = async (event) => {
      console.log("received message", event);
      const items = JSON.parse(event.data);
      onMessage(items);
      setLoading(false);
      //   setTempList(items);
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = (event) => {
      if (event.code === 1008) {
        localStorage.removeItem("jwt");
        window.location.href = "/"; // or wherever your login triggers
      }
      console.log("WebSocket Disconnected");
    };
    return () => {
      ws.close();
    };
  }, []);
  return { loading };
}

export default useWebsocket;
