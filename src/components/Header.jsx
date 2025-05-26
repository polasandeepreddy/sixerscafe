import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Book Slot", path: "/booking" },
    { label: "Booking Status", path: "/status" },  // ✅ New link added here
    { label: "Admin", path: "/admin" },
  ];

  return (
    <header className="bg-white border-bottom shadow-sm position-sticky top-0 z-3">
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img src="/cricket-logo.png" alt="Sixers Cafe" className="me-2" height="40" width="40" />
          <span className="fw-bold fs-4 text-dark">Sixers Cafe</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="btn d-lg-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <nav className="d-none d-lg-flex gap-4">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`text-decoration-none fs-5 ${
                pathname === path ? "text-success fw-semibold" : "text-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-top py-3 px-3 d-lg-none">
          <nav className="d-flex flex-column gap-3">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-decoration-none fs-5 ${
                  pathname === path ? "text-success fw-semibold" : "text-secondary"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
