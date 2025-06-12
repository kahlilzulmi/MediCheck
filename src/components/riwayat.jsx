import React, { useEffect, useState } from "react";

function Riwayat() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiwayat() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/riwayat");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched history data:", data);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRiwayat();
  }, []);

  return (
    <section
      id="riwayat"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Riwayat Pengecekan
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">No</th>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-left">Gejala</th>
                <th className="py-3 px-6 text-left">Prediksi Penyakit</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {loading ? (
                <tr
                  key="loading"
                  className="bg-red-500/30 backdrop-blur-md border-b border-red-200"
                >
                  <td colSpan="4" className="text-center py-6">
                    Memuat data...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr className="bg-red-800/80 backdrop-blur-md border-b border-red-200">
                  <td colSpan="4" className="text-center py-6">
                    Belum ada riwayat pengecekan.
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="bg-red-500/30 backdrop-blur-md border-b border-red-200"
                  >
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{item.tanggal}</td>
                    <td className="py-3 px-6">
                      {Array.isArray(item.gejala)
                        ? item.gejala.join(", ")
                        : item.gejala}
                    </td>
                    <td className="py-3 px-6">{item.prediksi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Riwayat;
