import React, { useState } from "react";

const symptomSuggestions = [
  "Ruam kulit",
  "Benjolan pada kulit",
  "Bersin terus-menerus",
  "Menggigil",
  "Kedinginan",
  "Nyeri sendi",
  "Sakit perut",
  "Asam lambung",
  "Luka pada lidah",
  "Penyusutan otot",
  "Muntah",
  "Nyeri saat buang air kecil",
  "Bercak darah saat buang air kecil",
  "Kelelahan",
  "Penambahan berat badan",
  "Kecemasan",
  "Tangan dan kaki dingin",
  "Perubahan suasana hati",
  "Penurunan berat badan",
  "Gelisah",
  "Lesu",
  "Bercak di tenggorokan",
  "Kadar gula tidak normal",
  "Batuk",
  "Demam tinggi",
  "Mata cekung",
  "Sesak napas",
  "Berkeringat",
  "Dehidrasi",
  "Gangguan pencernaan",
  "Sakit kepala",
  "Kulit menguning",
  "Urine berwarna gelap",
  "Mual",
  "Kehilangan nafsu makan",
  "Nyeri di belakang mata",
  "Sakit punggung",
  "Sembelit",
  "Nyeri perut",
  "Diare",
  "Demam ringan",
  "Urine berwarna kuning",
  "Mata menguning",
  "Gagal hati akut",
  "Kelebihan cairan",
  "Pembengkakan perut",
  "Pembengkakan kelenjar getah bening",
  "Malaise",
  "Penglihatan kabur dan terdistorsi",
  "Dahak",
  "Iritasi tenggorokan",
  "Kemerahan pada mata",
  "Tekanan sinus",
  "Hidung meler",
  "Sesak",
  "Nyeri dada",
  "Kelemahan pada anggota tubuh",
  "Detak jantung cepat",
  "Nyeri saat buang air besar",
  "Nyeri pada daerah anus",
  "Tinja berdarah",
  "Iritasi pada anus",
  "Nyeri leher",
  "Pusing",
  "Kram",
  "Memar",
  "Obesitas",
  "Pembengkakan kaki",
  "Pembengkakan pembuluh darah",
  "Wajah dan mata bengkak",
  "Pembesaran kelenjar tiroid",
  "Kuku rapuh",
  "Pembengkakan ekstremitas",
  "Rasa lapar berlebihan",
  "Hubungan di luar nikah",
  "Kering dan kesemutan pada bibir",
  "Bicara tidak jelas",
  "Nyeri lutut",
  "Nyeri sendi pinggul",
  "Kelemahan otot",
  "Kekakuan leher",
  "Pembengkakan sendi",
  "Kekakuan gerakan",
  "Gerakan berputar",
  "Kehilangan keseimbangan",
  "Ketidakstabilan",
  "Kelemahan pada satu sisi tubuh",
  "Kehilangan penciuman",
  "Ketidaknyamanan kandung kemih",
  "Bau urine tidak sedap",
  "Perasaan ingin berkemih terus-menerus",
  "Keluarnya gas",
  "Gatal-gatal di dalam",
  "Penampilan toksik (demam tifoid)",
  "Depresi",
  "Mudah tersinggung",
  "Nyeri otot",
  "Persepsi sensorik yang berubah",
  "Bintik merah di seluruh tubuh",
  "Nyeri perut",
  "Menstruasi tidak normal",
  "Noda dischromic",
  "Air mata dari mata",
  "Nafsu makan meningkat",
  "Poliuria",
  "Riwayat keluarga",
  "Lendir dalam dahak",
  "Dahak berkarat",
  "Kurangnya konsentrasi",
  "Gangguan penglihatan",
  "Menerima transfusi darah",
  "Menerima suntikan tidak steril",
  "Koma",
  "Pendarahan perut",
  "Perut membesar",
  "Riwayat konsumsi alkohol",
  "Darah dalam dahak",
  "Pembuluh darah menonjol di betis",
  "Palpitasi",
  "Nyeri saat berjalan",
  "Jerawat bernanah",
  "Komedo",
  "Keloid",
  "Kulit mengelupas",
  "Kekasaran kulit",
  "Cekungan kecil pada kuku",
  "Kuku meradang",
  "Lepuh",
  "Luka merah di sekitar hidung",
  "Kerak kuning yang mengeluarkan nanah",
];

function SymptomForm({ onSubmit }) {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomList, setSymptomList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSymptomInput(input);

    if (input.length > 0) {
      const filtered = symptomSuggestions.filter(
        (symptom) =>
          symptom.toLowerCase().includes(input.toLowerCase()) &&
          !symptomList.includes(symptom)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddSymptom = (e) => {
    e.preventDefault();
    const trimmed = symptomInput.trim();
    if (trimmed && !symptomList.includes(trimmed)) {
      setSymptomList([...symptomList, trimmed]);
      setSymptomInput("");
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSymptomList([...symptomList, suggestion]);
    setSymptomInput("");
    setSuggestions([]);
  };

  const handleRemoveSymptom = (index) => {
    const updatedList = symptomList.filter((_, i) => i !== index);
    setSymptomList(updatedList);
  };

  const handlePredict = () => {
    if (symptomList.length > 0) {
      // Konversi semua gejala ke lowercase sebelum dikirim
      const normalizedSymptoms = symptomList.map((symptom) =>
        symptom.toLowerCase()
      );
      console.log("Gejala dikirim ke API:", normalizedSymptoms);
      onSubmit(normalizedSymptoms);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto relative">
      <form onSubmit={handleAddSymptom} className="flex gap-4 mb-2 relative">
        <input
          type="text"
          className="w-full bg-white text-slate-500 p-3 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:ring-1"
          placeholder="Masukkan gejala..."
          value={symptomInput}
          onChange={handleInputChange}
        />
  
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-md rounded-md max-h-48 overflow-y-auto border border-gray-200">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-slate-600"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 mt-4">
  {symptomList.map((symptom, index) => (
    <div
      key={index}
      className="relative bg-gray-100 p-3 rounded-md shadow-sm hover:bg-red-200 transition duration-300"
    >
      <div className="flex justify-between items-start">
        <span className="text-slate-600">{symptom}</span>
        <button
          onClick={() => handleRemoveSymptom(index)}
          className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
          title="Hapus gejala"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 24 24"
            width="20px"
            fill="#5f6368"
          >
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71a1 1 0 0 0-1.42 1.42L10.59 12 5.71 16.88a1 1 0 1 0 1.42 1.42L12 13.41l4.88 4.88a1 1 0 0 0 1.42-1.42L13.41 12l4.88-4.88a1 1 0 0 0 0-1.41z"/>
          </svg>
        </button>
      </div>
    </div>
  ))}
</div>

      {symptomList.length > 0 && (
        <button
          onClick={handlePredict}
          className="bg-red-500 text-white font-bold rounded-md px-6 py-3 hover:bg-red-600 transition duration-300 w-full cursor-pointer"
        >
          Prediksi Penyakit
        </button>
      )}
    </div>
  );
}

export default SymptomForm;
