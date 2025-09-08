import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-700 shadow-md fixed w-full z-10">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600">
          Arnav Dhariya
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 md:space-x-8 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
          <li><Link to="/projects" className="hover:text-blue-600">Projects</Link></li>
          <li><Link to="/research" className="hover:text-blue-600">Research</Link></li>
          <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4 space-y-3 shadow w-full">
          <Link to="/" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/projects" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>Projects</Link>
          <Link to="/research" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>Research</Link>
          <Link to="/contact" className="block hover:text-blue-600" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
