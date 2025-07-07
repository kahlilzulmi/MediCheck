import React, { useState } from "react";
import api from "../services/api"; // Import the new centralized API service
import SymptomForm from "./form";
import { useUser } from "../context/UserContext";

const Hero = () => {
  const [result, setResult] = useState("");
  const { refreshAll } = useUser(); // Access refreshAll from UserContext

  const handleSubmit = async (data) => {
    try {
      // The api service now handles the URL and token automatically
      const response = await api.post("/predict", data);
      setResult(response.data.disease || "Tidak diketahui");
      // After successful prediction, refresh the riwayat data
      refreshAll(); 
    } catch (error) {
      console.error(error);
      // Display a more specific error message from the backend if available
      const errorMessage =
        error.response?.data?.detail ||
        "Gagal memprediksi. Cek gejala atau API.";
      setResult(errorMessage);
    }
  };

  return (
    <section
      id="hero"
      className="flex items-center justify-center flex-grow min-h-screen px-6"
      style={{
        backgroundImage: "url('/medicheck.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: 'rgba(87, 3, 10, 0.6)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="relative text-center p-10 rounded-lg shadow-xl max-w-xl w-full backdrop-blur-md bg-white/20">
        
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
};

export default Hero;
