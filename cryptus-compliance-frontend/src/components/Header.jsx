import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  FiUser, FiLogOut, FiGrid, FiChevronDown,
  FiDollarSign, FiBookOpen, FiShield,
} from "react-icons/fi";

const navLinks = [
  { label: "Features",   to: "/features"   },
  { label: "Frameworks", to: "/frameworks" },
  { label: "Pricing",    to: "/pricing"    },
  { label: "Resources",  to: "/resources"  },
];

const profileMenuItems = [
  { label: "Dashboard",  to: "/app/dashboard",  icon: FiGrid,       newTab: true },
  { label: "Profile",    to: "/profile",    icon: FiUser                    },
  { label: "Pricing",    to: "/pricing",    icon: FiDollarSign               },
  { label: "Resources",  to: "/resources",  icon: FiBookOpen                 },
  { label: "Frameworks", to: "/frameworks", icon: FiShield                   },
];

/* ── tiny helper: read user name from JWT payload ── */
function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.name || payload?.email || "User";
  } catch {
    return null;
  }
}

export default function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user,         setUser]         = useState(() => getUserFromToken());

  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* re-check auth whenever storage changes (e.g. after login) */
  useEffect(() => {
    const onStorage = () => setUser(getUserFromToken());
    window.addEventListener("storage", onStorage);
    /* also poll every 500 ms so same-tab login is detected */
    const id = setInterval(() => setUser(getUserFromToken()), 500);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(id); };
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  /* avatar initials */
  const initials = user
    ? user.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-indigo-100/40 border-b border-white/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16 md:h-[70px]">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Cryptus Compliance Logo" className="h-9 w-auto object-contain" />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50/80"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop Right ── */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* ── Profile Dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 group"
              >
                {/* Avatar circle */}
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner"
                  style={{ background: "linear-gradient(135deg,#6366f1,#155DFC)" }}>
                  {initials}
                </span>
                <span className="text-sm font-medium text-slate-700 max-w-[90px] truncate">
                  {user}
                </span>
                <FiChevronDown
                  className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Panel */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-100/60 overflow-hidden animate-fadeInDown">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{user}</p>
                  </div>

                  <div className="py-2">
                    {profileMenuItems.map(({ label, to, icon: Icon, newTab }) =>
                      newTab ? (
                        <a
                          key={to}
                          href={to}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all duration-150 group"
                        >
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          {label}
                        </a>
                      ) : (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all duration-150 group"
                        >
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          {label}
                        </Link>
                      )
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 group"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest Buttons ── */
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-full transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-300/40"
                style={{ background: "#155DFC" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-indigo-50 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={`md:hidden glass border-t border-white/40 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="mt-4 flex flex-col gap-2 border-t border-white/50 pt-4">
            {user ? (
              <>
                {profileMenuItems.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 rounded-xl hover:bg-red-50 transition text-left"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-white text-center px-4 py-3 rounded-xl transition"
                  style={{ background: "#155DFC" }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
