import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Newspaper,
  Bot,
  Settings,
  CloudSun,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";

/**
 * NavItem component for internal navigation links.
 */
const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link relative flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all font-bold tracking-tight ${isActive
          ? "active-link"
          : "hover-link"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className="nav-icon" />
          <span className="nav-text">{label}</span>
          {isActive && (
            <motion.div
              layoutId="nav-underline"
              className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--primary-color)] rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

/**
 * Main Navbar component with professional layout.
 */
const Navbar = () => {
  const { user, logout, openLogin } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-100">
      <div className="container-custom flex items-center justify-between h-20">

        {/* Branding/Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 branding-link"
          style={{ textDecoration: 'none' }}
        >
          <div className="logo-container w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--primary-color)] text-white shadow-lg">
            <CloudSun size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-gradient">
            SKYCAST
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/ai" icon={Bot} label="AI Insights" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>

        {/* Profile/User Section */}
        <div className="flex items-center gap-4 relative">
          <div className="md-block hidden-mobile" style={{ width: '1px', height: '2rem', backgroundColor: 'var(--border-color)' }} />
          {/* Login/User Icon removed as requested */}
        </div>

      </div>


      <style>{`
        .nav-link { text-decoration: none; color: var(--text-secondary); }
        .active-link { color: var(--primary-color) !important; }
        .hover-link:hover { color: var(--text-primary); }
        .branding-link { cursor: pointer; }
        .nav-text { font-size: 0.95rem; }
        @media (max-width: 768px) { .nav-text { display: none; } }
      `}</style>
    </nav>
  );
};

export default Navbar;
