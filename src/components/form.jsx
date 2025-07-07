import React, { useState, useEffect } from "react";
import SuhuCard from "../SuhuCard";

function SymptomForm({ onSubmit, onSymptomChange, result, loading }) {
  const [symptomInput, setSymptomInput] = useState("");
  const [suhu, setSuhu] = useState(null);

  useEffect(() => {
    if (onSymptomChange) onSymptomChange(symptomInput);
  }, [symptomInput, onSymptomChange]);

  const handleInputChange = (e) => {
    setSymptomInput(e.target.value);
  };

  const handleSuhuChange = (val) => {
    setSuhu(val);
  };

  const handlePredict = (e) => {
    e.preventDefault();
    // Split symptoms by comma, strip whitespace, and filter empty
    const normalizedSymptoms = symptomInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);
    if (normalizedSymptoms.length > 0 && suhu !== null) {
      onSubmit({ symptoms: normalizedSymptoms, suhu: parseFloat(suhu) });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative items-center justify-center">
      <form onSubmit={handlePredict} className="flex flex-col gap-4 mb-2 relative items-center justify-center">
        <input
          type="text"
          className="w-full bg-white text-black p-3 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:ring-1"
          placeholder="Masukkan gejala, pisahkan dengan koma (misal: demam, batuk, pusing)"
          value={symptomInput}
          onChange={handleInputChange}
        />

        <SuhuCard onSuhuChange={handleSuhuChange} />
        <button
          className={`bg-gray-700 text-white font-bold rounded-md px-6 py-3 transition duration-300 w-full ${
            symptomInput.trim().length === 0 || suhu === null
              ? "cursor-not-allowed bg-gray-700"
              : "cursor-pointer hover:bg-black"
          }`}
          disabled={symptomInput.trim().length === 0 || suhu === null}
          type="submit"
        >
          Prediksi Penyakit
        </button>

      </form>
      {/* Tampilkan hasil prediksi atau animasi loading */}
      {loading && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <p>Hasil Prediksi: <strong>Memuat...</strong></p>
        </div>
      )}
      {!loading && result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Hasil Prediksi: <strong>{result}</strong></p>
        </div>
      )}
    </div>
  );
}

export default SymptomForm;
