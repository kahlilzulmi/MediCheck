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
      setResult(response.data.disease || response.data.disease_id || response.data.response || "Tidak diketahui");
    } catch (error) {
      console.error(error);
      setResult("Gagal memprediksi. Cek gejala atau API.");
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center bg-gray-100 p-4"
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('public/wallpp.jpg')" }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/50 via-red-300/50 to-transparent"></div>

      <div className="relative text-center text-white z-10 px-4 max-w-lg mx-auto">
        <h1 className="font-bold text-5xl mb-4">Cek Kesehatan Anda.</h1>
        <h1 className="font-bold text-5xl text-red-500 mb-4">Sekarang.</h1>
        <p className="font-medium mb-8 text-gray-700">
          MediCheck adalah sebuah website yang dapat membantu Anda dalam
          memprediksi penyakit yang Anda alami.
        </p>

        <SymptomForm onSubmit={handleSubmit} result={result} />
      </div>
    </section>
  );
}

export default Hero;
