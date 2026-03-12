import { useState, useEffect } from "react";

export function useWebsocket(onMessage) {

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/communicate`);
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    // Handler is attached synchronously, before any messages can arrive
    ws.onmessage = async (event) => {
      console.log("received message", event);
      const items = JSON.parse(event.data);
      onMessage(items);
    //   setTempList(items);
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      ws.close();
    };
  }, []);  
}

export default useWebsocket;