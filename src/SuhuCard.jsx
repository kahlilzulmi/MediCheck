import { useEffect, useState } from "react";
import { useUser } from "./context/UserContext";

function SuhuCard({ onSuhuChange }) {
  const { user } = useUser();
  const [suhu, setSuhu] = useState(null);
  const [wsStatus, setWsStatus] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Only connect if device is registered
    if (!user || (!user.registered_device && !user.device_address)) {
      setSuhu(null);
      setWsStatus("Belum ada perangkat terdaftar. Silakan hubungkan perangkat terlebih dahulu.");
      if (ws) {
        ws.close();
        setWs(null);
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setWsStatus("Authentication token not found. Please log in.");
      setSuhu(null);
      return;
    }

    setWsStatus("Connecting...");
    const wsUrl = `ws://localhost:8000/device/ws/suhu?token=${token}`;
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    websocket.onopen = () => {
      setWsStatus("Terhubung ke perangkat.");
    };

    websocket.onmessage = (event) => {
      const receivedSuhu = event.data;
      setSuhu(receivedSuhu);
      if (onSuhuChange) {
        const suhuValue = parseFloat(receivedSuhu);
        if (!isNaN(suhuValue)) {
          onSuhuChange(suhuValue);
        }
      }
    };

    websocket.onerror = (error) => {
      setWsStatus("Gagal terhubung ke perangkat. Pastikan perangkat aktif dan terdaftar.");
      setSuhu(null);
    };

    websocket.onclose = (event) => {
      setWsStatus("Koneksi perangkat terputus.");
      setSuhu(null);
    };

    return () => {
      websocket.close();
      setWs(null);
    };
    // eslint-disable-next-line
  }, [user && (user.registered_device || user.device_address)]);

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
        {suhu ? suhu + " °C" : "-"}
      </p>
      {(!user || (!user.registered_device && !user.device_address)) && (
        <p style={{ fontSize: "0.8rem", color: "gray" }}>Belum ada perangkat terdaftar. Silakan hubungkan perangkat terlebih dahulu.</p>
      )}
      {suhu === null && wsStatus && (
        <p style={{ fontSize: "0.8rem", color: "gray" }}>{wsStatus}</p>
      )}
    </div>
  );
}

export default SuhuCard;
