import React from "react";

function Riwayat({ history = [] }) {
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
                <th className="py-3 px-6 text-left">Prediksi Penyakit</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {history.length === 0? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Belum ada riwayat pengecekan.
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{item.tanggal}</td>
                    <td className="py-3 px-6">{item.gejala.join(", ")}</td>
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
