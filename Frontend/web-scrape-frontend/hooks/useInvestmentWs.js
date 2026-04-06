import { useState, useEffect, useRef, useCallback } from "react";

export function useWebsocket(onMessage, token) {
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);
  console.log(token);
  useEffect(() => {
    if (!token) return;

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
    ws.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      ws.close();
    };
    // const mockData = {
    //   positions: [
    //     {
    //       id: 1,
    //       item: "Kzarka Longsword",
    //       qty: 200,
    //       buyPrice: 40,
    //       impact: "Very High",
    //       pnl: -10,
    //       currentPrice: 30,
    //     },
    //     {
    //       id: 2,
    //       item: "Dandelion Blade",
    //       qty: 1000,
    //       buyPrice: 10,
    //       impact: "Very High",
    //       pnl: 200,
    //       currentPrice: 20,
    //     },
    //   ],
    //   chart_data: {
    //     "Kzarka Longsword": [
    //       { date: "2025-03-01", actual: 4200000000, projected: 100000 },
    //       { date: "2025-03-08", actual: 4500000000, projected: 100000 },
    //       { date: "2025-03-15", actual: 4800000000, projected: 100000 },
    //     ],
    //     "Dandelion Blade": [
    //       { date: "2025-03-01", actual: 7200000000, projected: 100000 },
    //       { date: "2025-03-08", actual: 7000000000, projected: 100000 },
    //       { date: "2025-03-15", actual: 6500000000, projected: 100000 },
    //     ],
    //   },
    // };
    // onMessage(mockData);
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
