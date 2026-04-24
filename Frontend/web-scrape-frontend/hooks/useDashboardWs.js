import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

const STUB_DATA = {
  metrics: {
    itemsTracked: 247,
    activeEvents: 3,
    avgSevenDayChange: 6.2,
  },
  projections: [
    {
      id: 1,
      name: "Memory Fragment",
      currentPrice: 1420000,
      projectedPct: 14.2,
    },
    {
      id: 2,
      name: "Black Stone (Weapon)",
      currentPrice: 218000,
      projectedPct: -8.1,
    },
    { id: 3, name: "Cron Stone", currentPrice: 3100000, projectedPct: 2.3 },
    {
      id: 4,
      name: "Advice of Valks (+40)",
      currentPrice: 890000,
      projectedPct: 19.7,
    },
    {
      id: 5,
      name: "Black Stone (Armor)",
      currentPrice: 205000,
      projectedPct: -11.4,
    },
  ],
  biggestMovers: [
    {
      id: 4,
      name: "Advice of Valks (+40)",
      currentPrice: 890000,
      changePct: 31.4,
    },
    { id: 1, name: "Memory Fragment", currentPrice: 1420000, changePct: 22.8 },
    { id: 3, name: "Cron Stone", currentPrice: 3100000, changePct: 18.1 },
    {
      id: 2,
      name: "Black Stone (Weapon)",
      currentPrice: 218000,
      changePct: -14.3,
    },
  ],
  smallestMovers: [
    {
      id: 5,
      name: "Black Stone (Armor)",
      currentPrice: 205000,
      changePct: -0.4,
    },
    { id: 6, name: "Shining Powder", currentPrice: 62000, changePct: 0.8 },
    {
      id: 7,
      name: "Ancient Magic Crystal",
      currentPrice: 480000,
      changePct: 1.1,
    },
    { id: 8, name: "Pure Iron Crystal", currentPrice: 34000, changePct: -1.6 },
  ],
  highestImpactEvent: {
    name: "Summer Smashing Festival",
    impactLevel: "Very High",
    expectedListDate: "2025-04-28",
    drops: [
      { itemName: "Memory Fragment", quantity: 2000 },
      { itemName: "Black Stone (Weapon)", quantity: 500 },
      { itemName: "Cron Stone", quantity: 150 },
    ],
  },
};

export function useDashboard() {
  const [data, setData] = useState(STUB_DATA);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("No auth token found.");
      return;
    }

    const ws = new WebSocket(`${WS_URL}/dashboardWs?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse dashboard WS message:", e);
      }
    };

    ws.onerror = () => {
      setError("WebSocket error.");
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectTimer.current = setTimeout(connect, 5000);
    };
  }, []);

  useEffect(() => {
    // Swap STUB_DATA for connect() once backend is ready
    // connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { data, connected, error };
}
