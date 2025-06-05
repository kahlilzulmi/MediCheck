import React, { useEffect, useState } from "react";

function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <header className="bg-[var(--header-bg)] text-[var(--btn-dark)] shadow-md sticky top-0 z-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo di kiri */}
        <div className="text-xl font-bold">
          Medi<span className="text-[var(--primary-red)]">Check</span>
        </div>

        {/* Container kanan untuk nav + user button */}
        <div className="flex items-center space-x-6">
          {/* Nav link */}
          <nav className="space-x-6 text-sm font-medium hidden lg:flex">
            <a href="#home" className="hover:underline font-semibold">
              Beranda
            </a>
            <a href="#riwayat" className="hover:underline">
              Riwayat
            </a>
          </nav>

          {/* User profile button */}
          <a
            href="akun.html"
            className="inline-block bg-[var(--primary-red)] text-white px-4 py-1 rounded hover:bg-red-800 transition"
          >
            Akun
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
