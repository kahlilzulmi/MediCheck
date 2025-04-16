import React, { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token
    window.location.href = '/'; // Arahkan ke halaman login
  };
  
  return (
    <header className="bg-transparent sticky backdrop-blur-xs top-0 left-0 w-full items-center z-10 border-b-2 border-slate-300 flow-root">
      <div className="container">
        <div className="flex items-center justify-between relative">
          <div className="px-4">
            <a href="#home" className="font-bold text-3xl text-red-500 block py-6">
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
        <div className="relative ml-6">
              <button
                onClick={toggleMenu}
                className="rounded-full hover:bg-gray-200 focus:outline-none w-10 h-10 flex items-center justify-center"
              >
                <span className="fa-stack fa-xl">
                  <i className="fa-solid fa-circle fa-stack-2x text-gray-300"></i>
                  <i className="fa-solid fa-user fa-stack-1x text-black"></i>
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50">
                  <div className="flex items-center space-x-3">
                    <span className="fa-stack fa-2x w-10 h-10">
                      <i className="fa-solid fa-circle fa-stack-2x text-gray-300"></i>
                      <i className="fa-solid fa-user fa-stack-1x text-white"></i>
                    </span>
                    <span className="text-gray-800 font-medium">User Name</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
