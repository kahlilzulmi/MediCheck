import React, { useState } from "react";
import axios from "axios";

function Hero() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null); // Tambah state confidence

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const symptomArray = symptoms.split(",").map((s) => s.trim());
      const response = await axios.post("http://localhost:8000/predict", {
        symptoms: symptomArray,
      });

      setResult(response.data.disease_id);
      setConfidence(response.data.confidence); // Set confidence dari response
    } catch (error) {
      console.error(error);
      setResult("Gagal memprediksi. Cek gejala atau API.");
      setConfidence(null); // Reset confidence jika terjadi error
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center bg-gray-100 p-4"
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('assets/wallpp.jpg')" }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-red-500/50 to-transparent"></div>

      <div className="relative text-center text-white z-10 px-4 max-w-lg mx-auto">
        <h1 className="font-bold text-5xl mb-4">Cek Kesehatan Anda.</h1>
        <h1 className="font-bold text-5xl text-red-500 mb-4">Sekarang.</h1>
        <p className="font-medium mb-8 text-gray-700">
          MediCheck adalah sebuah website yang dapat membantu Anda dalam
          memprediksi penyakit yang Anda alami.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="w-full bg-white text-slate-500 p-3 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:ring-1"
              placeholder="Masukkan gejala..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <button
              type="submit"
              className="bg-red-500 text-white font-bold rounded-md px-6 py-3 hover:bg-red-600 transition duration-300 cursor-pointer"
            >
              Check
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>
              Hasil Prediksi: <strong>{result}</strong>
            </p>
            {confidence !== null && (
              <p className="text-sm mt-2 text-green-700">
                Tingkat akurasi: <strong>{confidence.toFixed(2)}%</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
