import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { COLORS } from "../styles/colors";

const PollutantChart = ({ data, type = "current", selectedUnit = "aqi" }) => {
  if (!data || !data.list || data.list.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
        <p style={styles.noData}>Data grafik tidak tersedia</p>
      </motion.div>
    );
  }

  // Prepare data untuk chart
  const prepareChartData = () => {
    if (type === "current") {
      // Data saat ini - single data point
      const components = data.list[0].components;
      const all = [
        { key: "pm25", name: "PM2.5", value: components.pm2_5 || 0, fill: COLORS.warning, unit: "μg/m³" },
        { key: "pm10", name: "PM10", value: components.pm10 || 0, fill: COLORS.navbar, unit: "μg/m³" },
        { key: "no2", name: "NO₂", value: components.no2 || 0, fill: COLORS.danger, unit: "μg/m³" },
        { key: "so2", name: "SO₂", value: components.so2 || 0, fill: COLORS.accent, unit: "μg/m³" },
        { key: "co", name: "CO", value: (components.co || 0) / 100, fill: COLORS.buttonPrimary, unit: "μg/m³" }, // Scale down CO
        { key: "o3", name: "O₃", value: components.o3 || 0, fill: COLORS.hover, unit: "μg/m³" },
      ];
      return selectedUnit && selectedUnit !== "aqi" ? all.filter((d) => d.key === selectedUnit) : all;
    } else {
      // Data historis - multiple data points
      return data.list
        .slice(0, 24)
        .map((item) => ({
          time: new Date(item.dt * 1000).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          PM25: item.components.pm2_5 || 0,
          PM10: item.components.pm10 || 0,
          NO2: item.components.no2 || 0,
          O3: item.components.o3 || 0,
        }))
        .reverse();
    }
  };

  const chartData = prepareChartData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => {
            const color = (entry.payload && entry.payload.fill) || entry.fill;
            const unit = (entry.payload && entry.payload.unit) || "μg/m³";
            return (
              <p key={index} style={{ ...styles.tooltipValue, color }}>
                {entry.name}: {Number(entry.value).toFixed(2)} {unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{type === "current" ? "📊 Tingkat Polutan Saat Ini" : "📈 Grafik Historis (24 Jam Terakhir)"}</h3>
        <p style={styles.subtitle}>{type === "current" ? "Konsentrasi polutan udara dalam mikrogram per meter kubik (μg/m³)" : "Tren perubahan kualitas udara dalam 24 jam terakhir"}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {type === "current" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 249, 244, 0.1)" />
            <XAxis dataKey="name" stroke={COLORS.textLight} style={{ fontSize: "0.9rem" }} />
            <YAxis
              stroke={COLORS.textLight}
              style={{ fontSize: "0.9rem" }}
              label={{
                value: "μg/m³",
                angle: -90,
                position: "insideLeft",
                style: { fill: COLORS.textLight },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1000} name="Konsentrasi">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 249, 244, 0.1)" />
            <XAxis dataKey="time" stroke={COLORS.textLight} style={{ fontSize: "0.8rem" }} />
            <YAxis
              stroke={COLORS.textLight}
              style={{ fontSize: "0.9rem" }}
              label={{
                value: "μg/m³",
                angle: -90,
                position: "insideLeft",
                style: { fill: COLORS.textLight },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: COLORS.textLight }} iconType="circle" />
            <Bar dataKey="PM25" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
            <Bar dataKey="PM10" fill={COLORS.navbar} radius={[4, 4, 0, 0]} />
            <Bar dataKey="NO2" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
            <Bar dataKey="O3" fill={COLORS.hover} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
};

const styles = {
  container: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  header: {
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.7)",
  },
  tooltip: {
    background: "rgba(46, 58, 63, 0.95)",
    backdropFilter: "blur(10px)",
    border: `1px solid rgba(249, 249, 244, 0.2)`,
    borderRadius: "8px",
    padding: "0.75rem",
  },
  tooltipLabel: {
    color: COLORS.textLight,
    fontWeight: "600",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
  },
  tooltipValue: {
    fontSize: "0.85rem",
    fontWeight: "500",
    margin: "0.25rem 0",
  },
  noData: {
    textAlign: "center",
    fontSize: "1rem",
    color: "rgba(249, 249, 244, 0.7)",
    padding: "2rem",
  },
};

export default PollutantChart;
