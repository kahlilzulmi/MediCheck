import React, { useState } from "react";

function SymptomForm({ onSubmit }) {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomList, setSymptomList] = useState([]);

  const handleAddSymptom = (e) => {
    e.preventDefault();
    const trimmed = symptomInput.trim();
    if (trimmed && !symptomList.includes(trimmed)) {
      setSymptomList([...symptomList, trimmed]);
      setSymptomInput("");
    }
  };

  const handleRemoveSymptom = (index) => {
    const updatedList = symptomList.filter((_, i) => i !== index);
    setSymptomList(updatedList);
  };

  const handlePredict = () => {
    if (symptomList.length > 0) {
      onSubmit(symptomList);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleAddSymptom} className="flex gap-4 mb-4">
        <input
          type="text"
          className="w-full bg-white text-slate-500 p-3 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:ring-1"
          placeholder="Masukkan gejala..."
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-500 text-white font-bold rounded-md px-4 py-3 hover:bg-blue-600 transition duration-300"
        >
          Tambah
        </button>
      </form>

      {/* Tampilkan daftar gejala */}
      <div className="space-y-2 mb-4">
        {symptomList.map((symptom, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
          >
            <span className="text-slate-600">{symptom}</span>
            <button
              onClick={() => handleRemoveSymptom(index)}
              className="text-red-500 hover:text-red-700 font-bold"
              title="Hapus gejala"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {symptomList.length > 0 && (
        <button
          onClick={handlePredict}
          className="bg-red-500 text-white font-bold rounded-md px-6 py-3 hover:bg-red-600 transition duration-300 w-full"
        >
          Prediksi Penyakit
        </button>
      )}
    </div>
  );
}

export default SymptomForm;
