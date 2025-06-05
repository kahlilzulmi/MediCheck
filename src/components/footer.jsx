import React from "react";

function Footer() {
  return (
    <footer className="bg-[var(--header-bg)] text-[var(--btn-dark)] px-8 py-6 border-t border-gray-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <h5 className="text-[var(--primary-red)] font-semibold mb-2">MediCheck</h5>
          <p className="text-sm">
            Platform prediksi penyakit berbasis kecerdasan buatan untuk membantu Anda memahami gejala yang dialami.
          </p>
        </div>
        <div>
          <h5 className="text-[var(--primary-red)] font-semibold mb-2">Sumber Daya</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Panduan Pengguna</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[var(--primary-red)] font-semibold mb-2">Developer</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Tentang Kami</a></li>
            <li><a href="#" className="hover:underline">Hubungi Kami</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[var(--primary-red)] font-semibold mb-2">Hubungi Kami</h5>
          <p className="text-sm">Kelompok 2</p>
          <p className="text-sm">Teknologi Kedokteran</p>
          <p className="text-sm">Institut Teknologi Sepuluh Nopember</p>
        </div>
      </div>
      <div className="border-t border-gray-300 pt-4 text-xs text-center space-y-1">
        <p>
          &copy; 2025 MediCheck. Hak Cipta Dilindungi. | Kebijakan Privasi | Syarat
        </p>
        <p>
          Disclaimer: MediCheck hanya memberikan prediksi berdasarkan gejala dan tidak menggantikan diagnosis medis profesional. Selalu konsultasikan dengan dokter.
        </p>
        <p className="text-gray-400">Kelompok 2 - Pemrograman Web</p>
      </div>
    </footer>
  );
}

export default Footer;
