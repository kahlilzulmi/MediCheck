import React from "react";
import { useUser } from "../context/UserContext";

function Riwayat() {
  const { riwayat, loading } = useUser();

  return (
    <section
      id="riwayat"
      className="flex flex-col items-center justify-start min-h-[calc(100vh-0px)] w-full px-6 py-10 bg-red-900 bg-opacity-70 scroll-mt-15"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
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
                <tr key="loading" className="bg-red-500/30 backdrop-blur-md border-b border-red-200">
                  <td colSpan="4" className="text-center py-6">Memuat data...</td>
                </tr>
              ) : riwayat.length === 0 ? (
                <tr className="bg-red-800/80 backdrop-blur-md border-b border-red-200">
                  <td colSpan="4" className="text-center py-6">Belum ada riwayat pengecekan.</td>
                </tr>
              ) : (
                riwayat.map((item, index) => (
                  <tr key={item._id || index} className="bg-red-500/30 backdrop-blur-md border-b border-red-200">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{item.tanggal}</td>
                    <td className="py-3 px-6">{Array.isArray(item.gejala) ? item.gejala.join(", ") : item.gejala}</td>
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
