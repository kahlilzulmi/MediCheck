import React, { useEffect, useRef, useState } from "react";
import DeviceManager from "./DeviceManager";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login"); // Redirect to login after logout
  };

  function Header() {
    const [username, setUsername] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDeviceModalOpen, setDeviceModalOpen] = useState(false);
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
      <>
        <header className="bg-[var(--header-bg)] text-[var(--btn-dark)] shadow-md sticky top-0 z-10">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo di kiri */}
            <div className="text-xl font-bold">
              Medi<span className="text-[var(--primary-red)]">Check</span>
            </div>

            {/* Container kanan untuk nav + user button */}
            <div className="flex items-center space-x-8">
              {/* Nav link */}
              <nav className="space-x-6 text-sm font-medium hidden lg:flex items-center">
                <a href="#hero" className="hover:underline font-semibold">
                  Beranda
                </a>
                <a href="#riwayat" className="hover:underline font-semibold">
                  Riwayat
                </a>
                <button
                  onClick={() => setDeviceModalOpen(true)}
                  className="hover:underline font-semibold"
                >
                  Kelola Perangkat
                </button>
              </nav>

              {/* User dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="inline-block bg-[var(--primary-red)] text-white px-4 py-1 rounded hover:bg-red-800 transition"
                >
                  {username || "Akun"}
                </button>

                {menuOpen && username && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-4 z-50">
                    <div className="font-medium mb-2">{username}</div>
                    <Link
                      to="/account"
                      className="px-4 text-gray-600 hover:text-blue-500"
                    >
                      My Account
                    </Link>
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

        {/* Device Manager Modal */}
        {isDeviceModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative text-black">
              <button
                onClick={() => setDeviceModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
              <DeviceManager />
            </div>
          </div>
        )}
      </>
    );
  }
};

export default Header;
