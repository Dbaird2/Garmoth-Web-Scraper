import { useState, useEffect, useRef, useCallback } from "react";

export function useWebsocket(onMessage, token) {
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);
  console.log("token in useWebsocket", token);
  useEffect(() => {
    if (!token) return;
    console.log("past token return");
    const ws = new WebSocket(
      `wss://web-scraper-68z5.onrender.com/investmentWs?token=` + token,
    );
    wsRef.current = ws;
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
        console.log("Removed JWT due to 1008 code");
        window.location.href = "/";
      }
      console.log("WebSocket Disconnected", event.code, event.reason);
    };

    return () => {
      ws.close();
    };
  }, [token]);
  const sendMessage = useCallback((type, message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ [type]: message }));
      return true;
    }
  }, []);
  return { loading, sendMessage };

  // return { loading };
}

export default useWebsocket;
