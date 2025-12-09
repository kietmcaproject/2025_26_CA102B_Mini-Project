import React from "react";
import { SiConsul } from "react-icons/si";
import { BsPhoneVibrate } from "react-icons/bs";
import { AiOutlineGlobal } from "react-icons/ai";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-12 py-3">
        {/* Logo / Brand */}
        <div className="text-xl text-gray-800">
          <SiConsul className="text-2xl" />
        </div>

        {/* Center Menu */}
        <ul className="flex items-center gap-6 text-gray-700 text-sm">
          <li className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors duration-200">
            <BsPhoneVibrate className="text-lg" />
            Support
          </li>
          <li className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors duration-200">
            <AiOutlineGlobal className="text-lg" />
            Languages
          </li>
        </ul>

        {/* Right Section - Login */}
        <Link to="/Login">
          <button className="bg-zinc-800 text-white px-4 py-1.5 rounded-full hover:scale-105 transition-transform duration-200">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
