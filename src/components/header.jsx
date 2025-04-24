import React, { useState, useEffect, useRef } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const menuRef = useRef(null); // Ref untuk dropdown

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
    window.location.href = "/";
  };

  // Menutup menu ketika klik di luar elemen menu
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
    <header className="bg-transparent sticky backdrop-blur-xs top-0 left-0 w-full items-center z-10 border-b-2 border-slate-300 flow-root">
      <div className="container">
        <div className="flex items-center justify-between relative">
          <div className="px-4">
            <a
              href="#home"
              className="font-bold text-3xl text-red-500 block py-6"
            >
              MediCheck
            </a>
          </div>
          <div className="flex items-center px-4">
            <nav
              id="nav-menu"
              className="hidden absolute py-5 lg:block lg:static lg:bg-transparent lg:max-w-full bg-white rounded-lg max-w-[250px] w-full right-4 top-full lg:rounded-none lg:shadow-none"
            >
              <ul className="block lg:flex">
                <li className="group">
                  <a
                    className="text-base text-dark py-2 mx-8 flex group-hover:text-red-500"
                    href="#home"
                  >
                    Beranda
                  </a>
                </li>
                <li className="group">
                  <a
                    className="text-base text-dark py-2 mx-8 flex group-hover:text-red-500"
                    href="#riwayat"
                  >
                    Riwayat
                  </a>
                </li>
                <li className="group">
                  <a
                    className="text-base text-dark py-2 mx-8 flex group-hover:text-red-500"
                    href="#article"
                  >
                    Article
                  </a>
                </li>
              </ul>
            </nav>

            {/* User Profile Menu */}
            <div className="relative ml-6" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="w-12 h-12 flex items-center justify-center border-black text-black hover:bg-red-500 rounded-full transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="w-6 h-6  hover:fill-white transition"
                >
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-800 font-medium py-2 px-4 mt-4">
                      {username || "Guest"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
