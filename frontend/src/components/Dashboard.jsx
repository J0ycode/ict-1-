import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

// ─── colour palettes ───────────────────────────────────────────────
const SALARY_COLOR = "#6366f1";
const HEALTH_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"];

// Active shape for the donut chart hover animation
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill={fill} fontWeight={700} fontSize={15}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#888" fontSize={13}>
        {value} employee{value !== 1 ? "s" : ""}
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" fill="#888" fontSize={12}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 12} outerRadius={outerRadius + 16}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// Custom tooltip for bar chart
const SalaryTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1e1e2e",
        border: "1px solid #6366f1",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#fff",
        fontSize: 13,
      }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#a5b4fc" }}>{label}</p>
        <p style={{ margin: "4px 0 0", color: "#e2e8f0" }}>
          Salary: <strong>₹{Number(payload[0].value).toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
};

// ─── age-band helper ────────────────────────────────────────────────
const ageBand = (age) => {
  if (age < 25) return "Under 25";
  if (age < 35) return "25–34";
  if (age < 45) return "35–44";
  if (age < 55) return "45–54";
  return "55+";
};

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3002/")
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Expense chart data: one bar per employee ─────────────────────
  const salaryData = employees.map((e) => ({
    name: e.ename || "—",
    salary: Number(e.esalary) || 0,
  }));

  // ── Health chart data: age-band distribution ─────────────────────
  const bandMap = {};
  employees.forEach((e) => {
    const band = ageBand(Number(e.eage));
    bandMap[band] = (bandMap[band] || 0) + 1;
  });
  const healthData = Object.entries(bandMap)
    .sort((a, b) => {
      const order = ["Under 25", "25–34", "35–44", "45–54", "55+"];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .map(([name, value]) => ({ name, value }));

  // ── Summary cards ────────────────────────────────────────────────
  const totalSalary = employees.reduce((s, e) => s + (Number(e.esalary) || 0), 0);
  const avgSalary = employees.length ? Math.round(totalSalary / employees.length) : 0;
  const avgAge = employees.length
    ? Math.round(employees.reduce((s, e) => s + (Number(e.eage) || 0), 0) / employees.length)
    : 0;

  const cards = [
    { label: "Total Employees", value: employees.length, color: "#6366f1", icon: "👥" },
    { label: "Total Payroll", value: `₹${totalSalary.toLocaleString()}`, color: "#22c55e", icon: "💰" },
    { label: "Avg. Salary", value: `₹${avgSalary.toLocaleString()}`, color: "#f59e0b", icon: "📊" },
    { label: "Avg. Age", value: `${avgAge} yrs`, color: "#3b82f6", icon: "🏥" },
  ];

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner} />
        <p style={{ color: "#94a3b8", marginTop: 16 }}>Loading dashboard…</p>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div style={styles.loader}>
        <p style={{ color: "#94a3b8", fontSize: 18 }}>No employee data found. Add some employees first.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <h1 style={styles.title}>📈 Employee Dashboard</h1>
        <p style={styles.subtitle}>Expense & Health Analytics</p>
      </div>

      {/* ── Summary Cards ── */}
      <div style={styles.cardRow}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...styles.card, borderTop: `4px solid ${c.color}` }}>
            <span style={styles.cardIcon}>{c.icon}</span>
            <div style={{ ...styles.cardValue, color: c.color }}>{c.value}</div>
            <div style={styles.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={styles.chartsRow}>
        {/* Expense Bar Chart */}
        <div style={styles.chartBox}>
          <h2 style={styles.chartTitle}>💸 Expense Overview</h2>
          <p style={styles.chartSub}>Salary per employee (₹)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
              <defs>
                <linearGradient id="salGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<SalaryTooltip />} />
              <Bar dataKey="salary" fill="url(#salGrad)" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Health Donut Chart */}
        <div style={styles.chartBox}>
          <h2 style={styles.chartTitle}>🏥 Health (Age Distribution)</h2>
          <p style={styles.chartSub}>Employee count by age group</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={healthData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {healthData.map((_, index) => (
                  <Cell key={index} fill={HEALTH_COLORS[index % HEALTH_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Department breakdown bar ── */}
      <div style={styles.deptSection}>
        <h2 style={styles.chartTitle}>🏢 Department Payroll Breakdown</h2>
        <p style={styles.chartSub}>Total salary spend grouped by department</p>
        <DeptChart employees={employees} />
      </div>
    </div>
  );
};

// ─── Department bar chart ───────────────────────────────────────────
const DeptTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1e1e2e",
        border: "1px solid #22c55e",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#fff",
        fontSize: 13,
      }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#86efac" }}>{label}</p>
        <p style={{ margin: "4px 0 0" }}>
          Total: <strong>₹{Number(payload[0].value).toLocaleString()}</strong>
        </p>
        <p style={{ margin: "2px 0 0", color: "#94a3b8" }}>
          Staff: {payload[1]?.value}
        </p>
      </div>
    );
  }
  return null;
};

const DeptChart = ({ employees }) => {
  const deptMap = {};
  employees.forEach((e) => {
    const dept = e.edept || "Unknown";
    if (!deptMap[dept]) deptMap[dept] = { total: 0, count: 0 };
    deptMap[dept].total += Number(e.esalary) || 0;
    deptMap[dept].count += 1;
  });
  const data = Object.entries(deptMap).map(([name, v]) => ({
    name,
    total: v.total,
    count: v.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="deptGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" />
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<DeptTooltip />} />
        <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 13 }}>{v === "total" ? "Payroll (₹)" : "Headcount"}</span>} />
        <Bar dataKey="total" name="total" fill="url(#deptGrad)" radius={[6, 6, 0, 0]} maxBarSize={70} />
        <Bar dataKey="count" name="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={70} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ─── Styles ────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)",
    padding: "32px 24px 60px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    textAlign: "left",
  },
  loader: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)",
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #2e3347",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "#f1f5f9",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
    marginTop: 6,
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  card: {
    background: "#1a1a2e",
    borderRadius: 16,
    padding: "22px 20px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    transition: "transform 0.2s",
    cursor: "default",
  },
  cardIcon: {
    fontSize: 26,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 800,
    marginTop: 8,
    letterSpacing: "-0.5px",
  },
  cardLabel: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
    fontWeight: 500,
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 24,
    marginBottom: 28,
  },
  chartBox: {
    background: "#1a1a2e",
    borderRadius: 20,
    padding: "24px 20px 12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#e2e8f0",
    margin: "0 0 2px",
  },
  chartSub: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 16,
  },
  deptSection: {
    background: "#1a1a2e",
    borderRadius: 20,
    padding: "24px 20px 16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
  },
};

export default Dashboard;
