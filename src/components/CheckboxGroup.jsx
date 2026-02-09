import React from "react";
import { COLORS } from "../styles/colors";

const CheckboxGroup = ({ label, options = [], selectedValues = [], onChange }) => {
  const handleCheckboxChange = (value) => {
    const newValues = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.checkboxContainer}>
        {options.map((option, index) => (
          <div key={index} style={styles.checkboxItem}>
            <input type="checkbox" id={`checkbox-${option.value}-${index}`} value={option.value} checked={selectedValues.includes(option.value)} onChange={() => handleCheckboxChange(option.value)} style={styles.input} />
            <label htmlFor={`checkbox-${option.value}-${index}`} style={styles.checkboxLabel}>
              {option.label}
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
    fontSize: "0.9rem",
    fontWeight: "500",
    color: COLORS.textLight,
  },
  checkboxContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(76, 140, 158, 0.15)",
    borderRadius: "8px",
    border: `1px solid rgba(249, 249, 244, 0.15)`,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  input: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: COLORS.buttonPrimary,
  },
  checkboxLabel: {
    fontSize: "0.95rem",
    color: COLORS.textLight,
    cursor: "pointer",
    userSelect: "none",
  },
};

export default CheckboxGroup;
