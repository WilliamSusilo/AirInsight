import React from "react";
import { COLORS } from "../styles/colors";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🌍 AirInsight</h4>
            <p style={styles.description}>Platform monitoring kualitas udara real-time untuk kesehatan Anda dan lingkungan</p>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Data Source</h4>
            <p style={styles.text}>
              Powered by{" "}
              <a href="https://openweathermap.org/api/air-pollution" target="_blank" rel="noopener noreferrer" style={styles.link}>
                OpenWeatherMap Air Pollution API
              </a>
            </p>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>About</h4>
            <p style={styles.text}>
              Dibuat dengan ❤️ untuk UTS Web Technology 3<br />
              William Susilo - 56220008
            </p>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.bottom}>
          <p style={styles.copyright}>© {currentYear} AirInsight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: "4rem",
    padding: "3rem 2rem 2rem",
    background: "rgba(46, 58, 63, 0.5)",
    backdropFilter: "blur(10px)",
    borderTop: `1px solid rgba(249, 249, 244, 0.1)`,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "0.5rem",
  },
  description: {
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.7)",
    lineHeight: 1.6,
  },
  text: {
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.7)",
    lineHeight: 1.6,
  },
  link: {
    color: COLORS.navbar,
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  divider: {
    height: "1px",
    background: "rgba(249, 249, 244, 0.1)",
    margin: "2rem 0",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copyright: {
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.6)",
  },
  badges: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  techBadge: {
    padding: "0.25rem 0.75rem",
    background: "rgba(76, 140, 158, 0.2)",
    borderRadius: "6px",
    fontSize: "0.85rem",
    color: COLORS.textLight,
  },
};

export default Footer;
