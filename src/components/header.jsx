import React, { useEffect, useRef, useState } from "react";

function Header() {
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            <a href="#hero" className="hover:underline font-semibold">
              Beranda
            </a>
            <a href="#riwayat" className="hover:underline">
              Riwayat
            </a>
          </nav>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="inline-block bg-[var(--primary-red)] text-white px-4 py-1 rounded hover:bg-red-800 transition"
            >
              Akun
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-4 z-50">
                <div className="font-medium mb-2">{username || "Guest"}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
