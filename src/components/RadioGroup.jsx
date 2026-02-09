import React from "react";
import { COLORS } from "../styles/colors";

const RadioGroup = ({ label, options = [], selectedValue, onChange, name = "radio-group" }) => {
  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.radioContainer}>
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              ...styles.radioItem,
              background: selectedValue === option.value ? "rgba(58, 125, 68, 0.3)" : "rgba(76, 140, 158, 0.15)",
              borderColor: selectedValue === option.value ? COLORS.buttonPrimary : "rgba(249, 249, 244, 0.15)",
            }}
          >
            <input type="radio" id={`radio-${option.value}-${index}`} name={name} value={option.value} checked={selectedValue === option.value} onChange={() => onChange(option.value)} style={styles.input} />
            <label htmlFor={`radio-${option.value}-${index}`} style={styles.radioLabel}>
              {option.icon && <span style={styles.icon}>{option.icon}</span>}
              <span>{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "600",
    color: COLORS.textLight,
  },
  radioContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  radioItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "12px",
    border: `2px solid`,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  input: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    accentColor: COLORS.buttonPrimary,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: COLORS.textLight,
    cursor: "pointer",
    userSelect: "none",
  },
  icon: {
    fontSize: "1.2rem",
  },
};

export default RadioGroup;
