import React, { useState, useEffect } from "react";
import SuhuCard from "../SuhuCard";

SuhuCard

function SymptomForm({ onSubmit, onSymptomChange, result }) {
  const [symptomInput, setSymptomInput] = useState("");

  useEffect(() => {
    if (onSymptomChange) onSymptomChange(symptomInput);
  }, [symptomInput, onSymptomChange]);

  const handleInputChange = (e) => {
    setSymptomInput(e.target.value);
  };

  const handlePredict = (e) => {
    e.preventDefault();
    // Split symptoms by comma, strip whitespace, and filter empty
    const normalizedSymptoms = symptomInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);
    if (normalizedSymptoms.length > 0) {
      onSubmit(normalizedSymptoms);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative items-center justify-center">
      <form onSubmit={handlePredict} className="flex flex-col gap-4 mb-2 relative items-center justify-center">
        <input
          type="text"
          className="w-full bg-white text-slate-500 p-3 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:ring-1"
          placeholder="Masukkan gejala, pisahkan dengan koma (misal: demam, batuk, pusing)"
          value={symptomInput}
          onChange={handleInputChange}
        />
        <SuhuCard />
        <button
          className={`bg-red-500 text-white font-bold rounded-md px-6 py-3 hover:bg-red-600 transition duration-300 w-full cursor-pointer ${
            symptomInput.trim().length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={symptomInput.trim().length === 0}
          type="submit"
        >
          Prediksi Penyakit
        </button>
      </form>
      {/* Tampilkan hasil prediksi di bawah tombol jika ada */}
      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Hasil Prediksi: <strong>{result}</strong></p>
        </div>
      )}
    </div>
  );
}

export default SymptomForm;
