import React from "react";
import { COLORS } from "../styles/colors";

const Dropdown = ({ label, value, onChange, options = [], placeholder = "Pilih opsi...", fullWidth = false }) => {
  return (
    <div style={{ ...styles.container, width: fullWidth ? "100%" : "auto" }}>
      {label && <label style={styles.label}>{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.select}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value} style={styles.option}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: COLORS.textLight,
    marginBottom: "0.25rem",
  },
  select: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontWeight: "500",
    color: COLORS.textLight,
    background: "rgba(76, 140, 158, 0.2)",
    border: `2px solid rgba(249, 249, 244, 0.2)`,
    borderRadius: "12px",
    outline: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  option: {
    background: COLORS.primaryBg,
    color: COLORS.textLight,
    padding: "0.5rem",
  },
};

export default Dropdown;
