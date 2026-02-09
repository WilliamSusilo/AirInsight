import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../styles/colors";

const Button = ({ children, onClick, variant = "primary", size = "medium", fullWidth = false, disabled = false, type = "button" }) => {
  const getButtonStyle = () => {
    const baseStyle = {
      padding: size === "small" ? "0.5rem 1rem" : size === "large" ? "1rem 2rem" : "0.75rem 1.5rem",
      fontSize: size === "small" ? "0.9rem" : size === "large" ? "1.1rem" : "1rem",
      fontWeight: "600",
      borderRadius: "12px",
      cursor: disabled ? "not-allowed" : "pointer",
      border: "none",
      outline: "none",
      width: fullWidth ? "100%" : "auto",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    };

    const variants = {
      primary: {
        background: COLORS.buttonPrimary,
        color: COLORS.textLight,
        boxShadow: "0 4px 16px rgba(58, 125, 68, 0.3)",
      },
      secondary: {
        background: COLORS.navbar,
        color: COLORS.textLight,
        boxShadow: "0 4px 16px rgba(76, 140, 158, 0.3)",
      },
      outline: {
        background: "transparent",
        color: COLORS.textLight,
        border: `2px solid ${COLORS.buttonPrimary}`,
        boxShadow: "none",
      },
      danger: {
        background: COLORS.danger,
        color: COLORS.textLight,
        boxShadow: "0 4px 16px rgba(181, 82, 57, 0.3)",
      },
    };

    return { ...baseStyle, ...variants[variant] };
  };

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      style={getButtonStyle()}
      whileHover={disabled ? {} : { scale: 1.05, boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)" }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
