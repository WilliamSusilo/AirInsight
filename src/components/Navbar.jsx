import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS } from "../styles/colors";

const Navbar = () => {
  return (
    <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoContainer}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.logo}>
            <span style={styles.logoIcon}>🌍</span>
            <span style={styles.logoText}>AirInsight</span>
          </motion.div>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Home
            </motion.span>
          </Link>
          <a href="https://openweathermap.org/api/air-pollution" target="_blank" rel="noopener noreferrer" style={styles.navLink}>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              API Source
            </motion.span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "1100px",
    zIndex: 1000,
    background: `rgba(76, 140, 158, 0.85)`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "20px",
    padding: "1rem 2rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logoContainer: {
    textDecoration: "none",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
  },
  logoIcon: {
    fontSize: "1.8rem",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: COLORS.textLight,
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
  },
  navLink: {
    color: COLORS.textLight,
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
};

export default Navbar;
