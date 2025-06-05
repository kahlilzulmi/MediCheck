import React, { useState } from "react";
import axios from "axios";
import SymptomForm from "./form";

function Hero() {
  const [result, setResult] = useState("");

  const handleSubmit = async (symptomArray) => {
    try {
      const response = await axios.post("http://localhost:8000/predict", {
        symptoms: symptomArray,
      });
      setResult(
        response.data.disease ||
          response.data.disease_id ||
          response.data.response ||
          "Tidak diketahui"
      );
    } catch (error) {
      console.error(error);
      setResult("Gagal memprediksi. Cek gejala atau API.");
    }
  };

  return (
    <section className="flex items-center justify-center flex-grow h-[calc(100vh-60px)] px-6 bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
      <div className="text-center p-10 rounded-lg shadow-xl max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Cek Kondisi Anda Sekarang!
        </h1>
        <p className="text-sm mb-6 text-white">
          Cukup masukkan gejala yang Anda rasakan. MediCheck akan membantu
          memprediksi penyakit Anda secara real-time dengan dukungan teknologi
          cerdas.
        </p>

        <SymptomForm onSubmit={handleSubmit} result={result} />
      </div>
    </section>
  );
}

export default Hero;
