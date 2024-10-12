import React from "react";

function NavBar() {
  return (
    <header className="w-[80%] mx-auto flex justify-between items-center px-10 h-10">
      <nav className="w-[70%] mx-auto mt-5">
        <ul className="flex justify-between bg-[#4379ef] text-white shadow-xl rounded-xl p-2">
          <li className="text-sm transition duration-300">
            Home
          </li>
          <li className="text-sm transition duration-300">
            About
          </li>
          <li className="text-sm transition duration-300">
            Project
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
