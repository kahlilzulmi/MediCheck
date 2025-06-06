import React, { useEffect, useState } from "react";

function Riwayat() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiwayat() {
      setLoading(true); // Pastikan loading true di awal fetch
      try {
        const res = await fetch("http://localhost:8000/riwayat"); // URL API Eksplisit
        if (!res.ok) {
          // Tangani HTTP errors seperti 404 atau 500
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched history data:", data); // Log data yang diterima
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err); // Log error jika terjadi
        setHistory([]); // Set history kosong jika ada error
      } finally {
        setLoading(false);
      }
    }
    fetchRiwayat();
  }, []); // Array dependensi kosong, fetch saat komponen mount

  return (
    <section id="riwayat" className="pt-36">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Riwayat Pengecekan
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">No</th>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-left">Gejala</th>
                {/* Tambahkan kolom Suhu jika ingin ditampilkan */}
                {/* <th className="py-3 px-6 text-left">Suhu (°C)</th> */}
                <th className="py-3 px-6 text-left">Prediksi Penyakit</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Memuat data...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Belum ada riwayat pengecekan.
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={item._id || index} className="border-b">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{item.tanggal}</td>
                    <td className="py-3 px-6">
                      {Array.isArray(item.gejala)
                        ? item.gejala.join(", ")
                        : item.gejala}
                    </td>
                    {/* Contoh jika ingin menampilkan suhu dari data MongoDB asli: */}
                    {/* <td className="py-3 px-6">{item.suhu ? item.suhu.toFixed(2) : '-'}</td> */}
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
