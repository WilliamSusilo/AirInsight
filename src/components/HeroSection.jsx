import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../styles/colors";

const HeroSection = () => {
  return (
    <section style={styles.hero}>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={styles.content}>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} style={styles.title}>
          🌍 AirInsight
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} style={styles.subtitle}>
          Lihat kondisi polusi udara terkini di sekitarmu 🌫️
        </motion.p>

        <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} style={styles.description}>
          Pantau kualitas udara real-time, identifikasi polutan berbahaya, dan dapatkan insight edukatif untuk kesehatan Anda dan lingkungan
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5 }} style={styles.badges}>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>📊</span>
            <span style={styles.badgeText}>Data Real-Time</span>
          </div>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>🌐</span>
            <span style={styles.badgeText}>Global Coverage</span>
          </div>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>🔬</span>
            <span style={styles.badgeText}>Scientific Data</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const styles = {
  hero: {
    padding: "6rem 2rem 3rem",
    textAlign: "center",
    maxWidth: "900px",
    margin: "0 auto",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: "700",
    color: COLORS.textLight,
    margin: 0,
    lineHeight: 1.1,
    letterSpacing: "-1px",
    textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
    fontWeight: "500",
    color: COLORS.hover,
    margin: 0,
    lineHeight: 1.4,
  },
  description: {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    color: "rgba(249, 249, 244, 0.85)",
    maxWidth: "700px",
    lineHeight: 1.7,
    margin: "0.5rem 0",
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "center",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(76, 140, 158, 0.2)",
    backdropFilter: "blur(10px)",
    border: `1px solid rgba(249, 249, 244, 0.2)`,
    borderRadius: "12px",
  },
  badgeIcon: {
    fontSize: "1.2rem",
  },
  badgeText: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: COLORS.textLight,
  },
};

export default HeroSection;
