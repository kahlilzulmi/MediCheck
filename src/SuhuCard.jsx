import { useEffect, useState } from "react";

function SuhuCard({ onSuhuChange }) {
  const [suhu, setSuhu] = useState(null);
  const [wsStatus, setWsStatus] = useState("Connecting..."); // New state for WebSocket status

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setWsStatus("Authentication token not found. Please log in.");
      return;
    }

    // Construct WebSocket URL with token for authentication
    // Assuming FastAPI's Depends(get_current_active_user) for WebSockets expects token in query
    const wsUrl = `ws://localhost:8000/device/ws/suhu?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setWsStatus("Connected");
    };

    ws.onmessage = (event) => {
      const receivedSuhu = event.data;
      console.log("Received suhu:", receivedSuhu);
      setSuhu(receivedSuhu); // Display the received string directly

      // If onSuhuChange is provided, parse to float and call it
      if (onSuhuChange) {
        const suhuValue = parseFloat(receivedSuhu);
        if (!isNaN(suhuValue)) {
          onSuhuChange(suhuValue);
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsStatus("Error connecting to device. Please ensure device is on and registered.");
      setSuhu(null); // Clear temperature on error
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      setWsStatus("Disconnected. Attempting to reconnect...");
      setSuhu(null); // Clear temperature on disconnect
      // Optional: Implement a reconnect logic here if desired
      // For simplicity, we're not implementing auto-reconnect in this example
    };

    // Cleanup function: close WebSocket when component unmounts
    return () => {
      console.log("Closing WebSocket connection.");
      ws.close();
    };
  }, []); // Empty dependency array to ensure WebSocket is established only once on mount

  return (
    <div style={{
      padding: "1rem",
      borderRadius: "1rem",
      backgroundColor: "#f1f1f1",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      width: "200px",
      textAlign: "center",
      justifyItems: "center"
    }}>
      <h3 style={{color: "black"}}>Suhu Badan</h3>
      <p style={{ fontSize: "2rem", margin: 0, color: "black" }}>
        {suhu ? suhu + " °C" : wsStatus}
      </p>
      {suhu === null && <p style={{ fontSize: "0.8rem", color: "gray" }}>{wsStatus}</p>}
    </div>
  );
}

export default SuhuCard;
