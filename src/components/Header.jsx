import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Book Slot", path: "/booking" },
    { label: "Booking Status", path: "/status" },
    { label: "Admin", path: "/admin" },
  ];

  return (
    <header className="bg-white border-bottom shadow-sm position-sticky top-0 z-3">
      <div className="container d-flex justify-content-between align-items-center py-2.5">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img
            src="/cricket-logo.png"
            alt="Sixers Cafe"
            className="me-2"
            height="30"
            width="30"
          />
          <span className="fw-bold fs-4 text-dark">Sixers cafe</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="btn d-lg-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Menu */}
        <nav className="d-none d-lg-flex gap-4">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`text-decoration-none fs-6 ${
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
        <nav
          id="mobile-menu"
          className="bg-white border-top py-2 px-3 d-lg-none d-flex flex-column gap-2"
          aria-label="Mobile primary navigation"
          role="menu"
        >
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-decoration-none fs-6 ${
                pathname === path ? "text-success fw-semibold" : "text-secondary"
              }`}
              role="menuitem"
              aria-current={pathname === path ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
