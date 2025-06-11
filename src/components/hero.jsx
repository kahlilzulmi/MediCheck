import React, { useState } from "react";
import axios from "axios";
import SymptomForm from "./form";

function Hero() {
  const [result, setResult] = useState("");

  // Perbaiki agar menerima object { symptoms, suhu }
  const handleSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/predict", data);
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
    <section
  className="flex items-center justify-center flex-grow min-h-screen px-6"
  style={{
    backgroundImage: "url('https://d3uhejzrzvtlac.cloudfront.net/compro/articleMobile/197_19_ketahui-seputar-manfaat-dan-persiapan-medical-check-up.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundColor: 'rgba(87, 3, 10, 0.9)',
    backgroundBlendMode: 'overlay',
  }}
>
  <div className="text-center p-10 rounded-lg shadow-xl max-w-xl w-full backdrop-blur-md bg-white/20">
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
