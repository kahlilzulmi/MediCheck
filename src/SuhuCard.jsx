import { useEffect, useState } from "react";
import axios from "axios";

function SuhuCard() {
  const [suhu, setSuhu] = useState(null);

  useEffect(() => {
    const fetchSuhu = async () => {
      try {
        const res = await axios.get("http://localhost:8000/suhu");
        if (res.data.length > 0) {
          setSuhu(res.data[0].suhu.toFixed(2));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuhu();
    const interval = setInterval(fetchSuhu, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <h3>Suhu Ruangan</h3>
      <p style={{ fontSize: "2rem", margin: 0 }}>
        {suhu ? suhu + " °C" : "Loading..."}
      </p>
    </div>
  );
}

export default SuhuCard;
