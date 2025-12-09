import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { BsPhoneVibrate } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import image from "../assets/Aero.jpg";

const MENU_ITEMS = [
  { name: "Home", to: "/" },
  { name: "Book Ticket", to: "/Book" },
  { name: "Hotel", to: "/Hotel" },
  {
    name: "Support",
    to: "/Support",
    icon: <BsPhoneVibrate className="text-lg" />,
  },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300">
      <nav className="flex items-center justify-between px-6 lg:px-12 py-3 relative">
        {/* 🌐 Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={image}
            alt="Aero Logo"
            className="h-12 w-24 object-cover rounded-sm hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* 🧭 Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              onClick={closeMenu}
              className={`flex items-center gap-2 font-medium text-[15px] transition-all duration-200 relative
                ${
                  isActive(item.to)
                    ? "text-blue-600 after:w-full"
                    : "text-gray-700 hover:text-blue-500"
                } 
                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-blue-600 after:w-0 hover:after:w-full after:transition-all after:duration-300`}
            >
              {item.icon && item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* ✈️ Right Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/contact"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-transform duration-200 shadow-sm
              ${
                isActive("/contact")
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-blue-600 text-white hover:scale-105"
              }`}
          >
            Contact
          </Link>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200
                ${
                  isActive("/login")
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full text-sm font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>

        {/* 📱 Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="text-2xl md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* 📱 Mobile Dropdown */}
        {menuOpen && (
          <>
            {/* Dimmed Background */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden animate-fadeIn z-40"
              onClick={closeMenu}
            ></div>

            {/* Dropdown */}
            <div className="absolute top-16 right-6 w-64 bg-white shadow-2xl border rounded-xl py-5 flex flex-col items-center gap-3 z-50 animate-slideDown">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={closeMenu}
                  className={`flex items-center justify-center gap-2 w-full py-2 font-medium transition-all duration-200
                    ${
                      isActive(item.to)
                        ? "text-blue-600 scale-105"
                        : "text-gray-700 hover:text-blue-500"
                    }`}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col w-[80%] mt-3 gap-3">
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="block text-center py-2 rounded-full bg-blue-600 text-white hover:scale-105 transition-transform duration-200 text-sm font-medium shadow-sm"
                >
                  Contact
                </Link>

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block text-center py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-transform duration-200 text-sm font-medium"
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="block w-full text-center py-2 border rounded-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-transform duration-200 text-sm font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Nav;
