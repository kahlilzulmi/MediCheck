import { useEffect, useState } from "react";
import axios from "axios";

function SuhuCard({ onSuhuChange }) {
  const [suhu, setSuhu] = useState(null);

  useEffect(() => {
    const fetchSuhu = async () => {
      try {
        const res = await axios.get("http://localhost:8000/suhu");
        if (res.data.length > 0) {
          const suhuValue = parseFloat(res.data[0].suhu);
          setSuhu(suhuValue.toFixed(2));
          if (onSuhuChange) onSuhuChange(suhuValue);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuhu();
    const interval = setInterval(fetchSuhu, 20000); // 20 detik
    return () => clearInterval(interval);
  }, [onSuhuChange]);

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
      <h3 style={{color: "black"}}>Suhu Ruangan</h3>
      <p style={{ fontSize: "2rem", margin: 0, color: "black" }}>
        {suhu ? suhu + " °C" : "Loading..."}
      </p>
    </div>
  );
}

export default SuhuCard;
