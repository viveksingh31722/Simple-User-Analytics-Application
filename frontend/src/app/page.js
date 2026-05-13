"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("sessions"); // "sessions" | "heatmap"
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPageUrl, setSelectedPageUrl] = useState("");
  const [heatmapClicks, setHeatmapClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [normalizationMode, setNormalizationMode] = useState("normalized"); // "normalized" | "absolute"

  const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE || "http://localhost:5000/api";

  // Fetch all aggregated sessions and distinct pages on mount
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const resSessions = await fetch(`${BACKEND_BASE}/sessions`);
      if (resSessions.ok) {
        const data = await resSessions.json();
        setSessions(data);
        if (data.length > 0 && !selectedSessionId) {
          setSelectedSessionId(data[0]._id);
        }
      }

      const resPages = await fetch(`${BACKEND_BASE}/pages`);
      if (resPages.ok) {
        const pData = await resPages.json();
        setPages(pData);
        if (pData.length > 0) {
          const defaultPage = pData.find(p => p.includes("demo")) || pData[0];
          setSelectedPageUrl(defaultPage);
        } else {
          setSelectedPageUrl("http://localhost:3000/demo");
        }
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    const fetchSessionEvents = async () => {
      setEventsLoading(true);
      try {
        const res = await fetch(`${BACKEND_BASE}/sessions/${selectedSessionId}/events`);
        if (res.ok) {
          const data = await res.json();
          setSessionEvents(data);
        }
      } catch (err) {
        console.error("Failed to fetch session events:", err);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchSessionEvents();
  }, [selectedSessionId]);

  useEffect(() => {
    if (activeTab !== "heatmap" || !selectedPageUrl) return;
    const fetchHeatmap = async () => {
      setHeatmapLoading(true);
      try {
        const res = await fetch(`${BACKEND_BASE}/pages/heatmap?pageUrl=${encodeURIComponent(selectedPageUrl)}`);
        if (res.ok) {
          const data = await res.json();
          setHeatmapClicks(data);
        }
      } catch (err) {
        console.error("Failed to fetch heatmap clicks:", err);
      } finally {
        setHeatmapLoading(false);
      }
    };
    fetchHeatmap();
  }, [activeTab, selectedPageUrl]);

  const totalCapturedSessions = sessions.length;
  const totalCapturedEvents = sessions.reduce((acc, s) => acc + s.totalEvents, 0);
  const totalPageViews = sessions.reduce((acc, s) => acc + s.pageViews, 0);
  const totalClicks = sessions.reduce((acc, s) => acc + s.clicks, 0);

  // Reference graph mock point strings for visual wow-factor matching user provided image exactly
  const cyanCurvePoints = "M 0 120 Q 30 30 60 110 T 120 40 T 180 140 T 240 20 T 300 130 T 360 40 T 420 150 T 480 50 T 540 160";
  const pinkCurvePoints = "M 0 150 Q 40 80 80 140 T 160 100 T 240 130 T 320 60 T 400 130 T 480 30 T 540 170";

  return (
    <div className="app-container">
      {/* Defined reusable SVG Gradients for glowing custom graph areas */}
      <svg style={{ width: 0, height: 0, position: "absolute" }}>
        <defs>
          <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="pink-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f72585" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f72585" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Modern High Fidelity Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="navbar"
      >
        <Link href="/" className="logo-brand">
          <div className="logo-icon">CF</div>
          <span>CausalFunnel <span style={{ fontWeight: 300, color: "var(--neon-cyan)" }}>Telemetry</span></span>
        </Link>
        <div className="nav-links">
          <button 
            onClick={() => setActiveTab("sessions")} 
            className={`btn-nav ${activeTab === "sessions" ? "active" : ""}`}
          >
            Sessions Engine
          </button>
          <button 
            onClick={() => setActiveTab("heatmap")} 
            className={`btn-nav ${activeTab === "heatmap" ? "active" : ""}`}
          >
            Neural Overlay Matrix
          </button>
        </div>
        <div>
          <Link href="/demo" className="btn-premium" target="_blank">
            <span>Access Store Nodes</span>
            <span style={{ fontSize: "1.2rem" }}>↗</span>
          </Link>
        </div>
      </motion.nav>

      {/* Main Framework Viewport */}
      <main style={{ padding: "32px 48px", maxWidth: "1700px", margin: "0 auto", width: "100%" }}>
        {/* Title Block */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <h1 className="heading-gradient">Next-Gen Analytics Engine</h1>
            <p className="subtitle">Real-time interaction mapping driven by serverless Mongoose telemetry arrays.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData} 
            style={{ 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid var(--border-color)", 
              padding: "10px 20px", 
              borderRadius: "12px",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span style={{ color: "var(--neon-cyan)" }}>●</span> 
            {loading ? "Re-syncing Cluster..." : "Telemetry Live"}
          </motion.button>
        </motion.div>

        {/* Dynamic Summary Cards */}
        <div className="counters-grid">
          {[
            { label: "Tracked Flow Tokens", val: totalCapturedSessions, color: "var(--neon-cyan)" },
            { label: "Total Data Nodes", val: totalCapturedEvents, color: "var(--neon-pink)" },
            { label: "Rendered Viewports", val: totalPageViews, color: "var(--neon-cyan)" },
            { label: "Intercepted Pulsar Coordinates", val: totalClicks, color: "var(--neon-pink)" }
          ].map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="counter-card"
            >
              <span className="counter-label">{card.label}</span>
              <span className="counter-value" style={{ color: card.color }}>{card.val}</span>
            </motion.div>
          ))}
        </div>

        {/* INTEGRATION OF THE SPECIFIED VISUAL REFERENCE GRAPHS MATRIX */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="analytics-grid-mordern"
        >
          {/* Left Chart Suite: Glowing Multi-Curve Area Engine & Calendar Widget */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* Primary Area Chart Component */}
            <div className="area-chart-wrapper">
              <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Autonomous Session Trajectory Curves
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--neon-cyan)" }}>
                  ● Ingestion Streams (Cyan: Flows | Pink: Coordinates)
                </span>
              </div>
              
              {/* Background scale grid overlay */}
              <div className="chart-grid-bg">
                {Array.from({ length: 45 }).map((_, i) => (
                  <div key={i} className="chart-grid-line" />
                ))}
              </div>

              {/* Monospace Y Axis Parameters */}
              <div className="chart-y-axis">
                <span>180</span><span>140</span><span>100</span><span>60</span><span>20</span>
              </div>

              {/* Immersive Curves Canvas using Framer Motion SVG projection */}
              <div className="chart-curves-stage">
                <svg viewBox="0 0 540 180" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  {/* Cyan Curve Area Fill */}
                  <path d={`${cyanCurvePoints} L 540 180 L 0 180 Z`} className="area-fill-cyan" />
                  {/* Cyan Curve Line Path */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={cyanCurvePoints} 
                    className="curve-path-cyan" 
                  />

                  {/* Pink Curve Area Fill */}
                  <path d={`${pinkCurvePoints} L 540 180 L 0 180 Z`} className="area-fill-pink" />
                  {/* Pink Curve Line Path */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    d={pinkCurvePoints} 
                    className="curve-path-pink" 
                  />
                </svg>
              </div>

              {/* Horizontal Label Axis */}
              <div className="chart-x-axis">
                <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span><span>I</span><span>J</span>
              </div>

              <div style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                <strong style={{ color: "white" }}>Lorem ipsum dolor</strong> — dynamic tracking coordinate streams aligned across global timestamps.
              </div>
            </div>

            {/* Bottom Chart Suite: Calendar Component & Column Distribution Bars */}
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "20px" }}>
              {/* Sleek Dark Month Calendar Grid matching reference image bottom left */}
              <div className="calendar-widget">
                <div className="cal-header">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="cal-days">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const dayNum = i + 1;
                    // Apply visual highlight sets modeled precisely after visual preview
                    let customClass = "";
                    if ([7, 14, 21, 28].includes(dayNum)) customClass = "active-pink";
                    if ([22, 29, 30, 31].includes(dayNum)) customClass = "active-cyan";
                    return (
                      <div key={i} className={`cal-day-item ${customClass}`}>
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stacked Vertical Segment Towers matching reference image bottom right */}
              <div className="stacked-cols-widget">
                {/* Fixed Background scale metrics */}
                <div style={{ position: "absolute", left: "10px", top: "15px", bottom: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span>
                </div>
                <div style={{ display: "flex", width: "calc(100% - 30px)", marginLeft: "30px", height: "100%", gap: "10px", alignItems: "flex-end" }}>
                  {[
                    { c: 50, p: 0 }, { c: 0, p: 80 }, { c: 40, p: 0 }, { c: 0, p: 65 },
                    { c: 90, p: 0 }, { c: 0, p: 55 }, { c: 70, p: 0 }, { c: 0, p: 30 },
                    { c: 80, p: 0 }, { c: 0, p: 90 }
                  ].map((col, idx) => (
                    <motion.div 
                      key={idx} 
                      className="stacked-col-bar"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 1, delay: idx * 0.05 }}
                    >
                      {col.c > 0 && <div className="col-fill-cyan" style={{ height: `${col.c}%` }} />}
                      {col.p > 0 && <div className="col-fill-pink" style={{ height: `${col.p}%` }} />}
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textAlign: "center", marginTop: "4px", fontWeight: "bold" }}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Layout Module: Concentric Percentage Multi-Rings & Distribution Tracks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Concentric Percentage Dials matching user provided image exactly */}
            <div className="gauges-matrix">
              {[
                { val: "65%", col1: "var(--neon-cyan)", col2: "var(--neon-pink)", deg: 234 },
                { val: "50%", col1: "var(--neon-cyan)", col2: "var(--neon-pink)", deg: 180 },
                { val: "25%", col1: "var(--neon-pink)", col2: "white", deg: 90 },
                { val: "75%", col1: "var(--neon-cyan)", col2: "var(--neon-pink)", deg: 270 }
              ].map((ring, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="gauge-ring-item"
                >
                  {/* Outer vibrant border simulation rings using custom modern embedded SVG patterns */}
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Unfilled base arc */}
                    <circle cx="60" cy="60" r="46" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                    {/* Glow stroke mapped proportionally */}
                    <motion.circle 
                      initial={{ strokeDasharray: "0 300" }}
                      animate={{ strokeDasharray: `${ring.deg} 300` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="60" cy="60" r="46" 
                      stroke={ring.col1} 
                      strokeWidth="12" 
                      fill="none" 
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      filter={`drop-shadow(0 0 6px ${ring.col1})`}
                    />
                    {/* Inner highlight sector */}
                    <circle cx="60" cy="60" r="32" stroke={ring.col2} strokeWidth="4" fill="none" opacity="0.8" strokeDasharray="40 100" />
                  </svg>
                  <div className="gauge-label-inner">{ring.val}</div>
                  <div className="gauge-subtitle">Telemetry Core {idx + 1}</div>
                </motion.div>
              ))}
            </div>

            {/* Horizontal Stacked Multi-Colored Track Bars */}
            <div className="bars-module">
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white", textTransform: "uppercase" }}>
                Horizontal Pulse Stratification
              </span>
              {[
                { label: "Flow Velocity", segs: [40, 60] },
                { label: "Viewport Ratio", segs: [80, 20] },
                { label: "Beacon Exit", segs: [50, 50] },
                { label: "Latency Node", segs: [70, 30] }
              ].map((row, i) => (
                <div key={i} className="bar-row">
                  <span className="bar-label">{row.label}</span>
                  <div className="bar-track">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${row.segs[0]}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bar-fill-seg" 
                      style={{ background: i % 2 === 0 ? "var(--neon-cyan)" : "var(--neon-pink)" }} 
                    />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${row.segs[1]}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      style={{ background: i % 2 === 0 ? "var(--neon-blue)" : "var(--neon-purple)", flex: 1 }} 
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Primary Functional Tabs Switching Viewport */}
        <motion.div 
          layout
          className="glass-panel" 
          style={{ padding: 0, overflow: "hidden" }}
        >
          {/* Internal Header Control Box */}
          <div style={{ padding: "22px 28px", borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
                onClick={() => setActiveTab("sessions")}
                style={{
                  padding: "10px 24px",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeTab === "sessions" ? "var(--neon-cyan)" : "transparent",
                  color: activeTab === "sessions" ? "#0a0e17" : "white",
                  transition: "all 0.2s ease"
                }}
              >
                Sessions Journey Workspace
              </button>
              <button 
                className={`tab-btn ${activeTab === "heatmap" ? "active" : ""}`}
                onClick={() => setActiveTab("heatmap")}
                style={{
                  padding: "10px 24px",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeTab === "heatmap" ? "var(--neon-pink)" : "transparent",
                  color: activeTab === "heatmap" ? "white" : "var(--text-secondary)",
                  transition: "all 0.2s ease"
                }}
              >
                Interaction Scatter Overlay Stage
              </button>
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
              Mongoose Database Pipe: <span style={{ color: "var(--neon-cyan)", fontWeight: "bold" }}>● Synchronized</span>
            </span>
          </div>

          <div style={{ padding: "28px" }}>
            <AnimatePresence mode="wait">
              {activeTab === "sessions" ? (
                /* FUNCTIONAL SESSIONS VIEW */
                <motion.div 
                  key="sessions"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="dashboard-layout" 
                  style={{ padding: 0 }}
                >
                  {/* Live Sidebar Workspace */}
                  <div className="sessions-sidebar">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Captured Token Nodes ({sessions.length})
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "var(--neon-cyan)", fontWeight: 700 }}>30m Sliding Threshold</span>
                    </div>

                    {sessions.length === 0 ? (
                      <div className="empty-state" style={{ height: "200px" }}>
                        No session frames captured. Open the demo endpoint to trigger realtime stream arrays.
                      </div>
                    ) : (
                      sessions.map((session, sIdx) => {
                        const isSelected = session._id === selectedSessionId;
                        const startTimeStr = new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        const isLive = Date.now() - new Date(session.endTime).getTime() <= 30 * 60 * 1000;

                        return (
                          <motion.div 
                            key={session._id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sIdx * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`session-card ${isSelected ? "selected" : ""}`}
                            onClick={() => setSelectedSessionId(session._id)}
                          >
                            <div className="session-header">
                              <span className="session-id" title={session._id}>
                                {session._id.substring(0, 16)}...
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ 
                                  fontSize: "0.65rem", 
                                  fontWeight: 900, 
                                  padding: "2px 8px", 
                                  borderRadius: "6px",
                                  background: isLive ? "rgba(0, 245, 212, 0.15)" : "rgba(255,255,255,0.05)",
                                  color: isLive ? "var(--neon-cyan)" : "var(--text-muted)",
                                  border: `1px solid ${isLive ? "var(--neon-cyan)" : "transparent"}`
                                }}>
                                  {isLive ? "● LIVE" : "EXPIRED"}
                                </span>
                                <span className="session-time">{startTimeStr}</span>
                              </div>
                            </div>
                            <div className="session-stats">
                              <span className="stat-badge views" title="Page Views">
                                👁 {session.pageViews}
                              </span>
                              <span className="stat-badge clicks" title="Absolute Global Clicks">
                                🖱 {session.clicks}
                              </span>
                              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>
                                {session.totalEvents} payload total
                              </span>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Right Timeline Viewport */}
                  <div className="detail-pane">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                      <div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "white" }}>Chronological Execution Path</h2>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                          Active Container Key: <code style={{ color: "var(--neon-cyan)", fontWeight: "bold" }}>{selectedSessionId || "None"}</code>
                        </p>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                        Oldest Event Node → Newest Event Node
                      </span>
                    </div>

                    {eventsLoading ? (
                      <div className="empty-state">
                        <div style={{ width: "40px", height: "40px", border: "3px solid var(--border-color)", borderTopColor: "var(--neon-cyan)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        <p style={{ marginTop: "16px", fontWeight: "bold" }}>Ingesting journey pipeline sequence...</p>
                      </div>
                    ) : !selectedSessionId ? (
                      <div className="empty-state">
                        <p style={{ fontSize: "1.1rem", color: "white" }}>No Workspace Focused</p>
                        <p style={{ maxWidth: "320px" }}>Select any single tracking container from the left array block to parse real-time event sequences.</p>
                      </div>
                    ) : sessionEvents.length === 0 ? (
                      <div className="empty-state">
                        <p>Zero event blocks recorded inside this specific context duration.</p>
                      </div>
                    ) : (
                      <div className="timeline">
                        {sessionEvents.map((evt, idx) => {
                          const timeStr = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 1 });
                          return (
                            <motion.div 
                              key={evt._id || idx} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`timeline-event ${evt.eventType}`}
                            >
                              <div className="timeline-dot" title={evt.eventType} />
                              <div className="event-content">
                                <div className="event-top">
                                  <span className={`event-type-label ${evt.eventType}`}>
                                    {evt.eventType === 'page_view' ? 'Page View Array' : 'Mouse Intercept'}
                                  </span>
                                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>{timeStr}</span>
                                </div>
                                <div className="event-url">{evt.pageUrl}</div>
                                {evt.eventType === 'click' && evt.x !== null && evt.y !== null && (
                                  <div className="event-coords">
                                    <span>X Offset: <strong style={{ color: "var(--neon-pink)" }}>{evt.x}px</strong></span>
                                    <span>Y Offset: <strong style={{ color: "var(--neon-pink)" }}>{evt.y}px</strong></span>
                                    {evt.viewportWidth && (
                                      <span style={{ color: "var(--text-muted)" }}>[Base Display Width: {evt.viewportWidth}px]</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* FUNCTIONAL HEATMAP STAGE */
                <motion.div
                  key="heatmap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="heatmap-controls" style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Target Application Frame URL
                        </label>
                        <select 
                          className="select-premium"
                          value={selectedPageUrl}
                          onChange={(e) => setSelectedPageUrl(e.target.value)}
                        >
                          {pages.length === 0 ? (
                            <option value="http://localhost:3000/demo">http://localhost:3000/demo (Default Pipe)</option>
                          ) : (
                            pages.map((pUrl, i) => (
                              <option key={i} value={pUrl}>{pUrl}</option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Normalization Layout Strategy Configuration Switches */}
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Projection Matrix Engine
                        </label>
                        <div style={{ display: "flex", background: "rgba(0,0,0,0.5)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                          <button
                            type="button"
                            onClick={() => setNormalizationMode("normalized")}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "8px",
                              border: "none",
                              fontSize: "0.85rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              background: normalizationMode === "normalized" ? "var(--neon-cyan)" : "transparent",
                              color: normalizationMode === "normalized" ? "#0a0e17" : "white",
                              transition: "all 0.2s ease"
                            }}
                          >
                            Proportional Scaling (Responsive)
                          </button>
                          <button
                            type="button"
                            onClick={() => setNormalizationMode("absolute")}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "8px",
                              border: "none",
                              fontSize: "0.85rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              background: normalizationMode === "absolute" ? "var(--neon-pink)" : "transparent",
                              color: normalizationMode === "absolute" ? "white" : "var(--text-secondary)",
                              transition: "all 0.2s ease"
                            }}
                          >
                            Raw Absolute Scroller Offsets
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ alignSelf: "flex-end" }}>
                      <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                        Plotted Pulsars: <strong style={{ color: "var(--neon-pink)", fontSize: "1.2rem" }}>{heatmapClicks.length}</strong> dots intercepted.
                      </span>
                    </div>
                  </div>

                  {/* Responsive Visual Layer Box */}
                  <div className="heatmap-stage-container">
                    {/* Glowing coordinate scatters overlay */}
                    <div className="heatmap-overlay">
                      {heatmapClicks.map((pt, i) => {
                        const isNormalized = normalizationMode === "normalized" && pt.viewportWidth;
                        const leftPos = isNormalized ? `${(pt.x / pt.viewportWidth) * 100}%` : `${pt.x}px`;

                        return (
                          <div 
                            key={i} 
                            className="click-dot"
                            style={{ left: leftPos, top: `${pt.y}px` }} 
                            title={`Captured coordinate pulse mapped to surface at X:${pt.x}px`}
                          />
                        );
                      })}
                    </div>

                    {/* Dark Sci-Fi functional stage mockup rendering responsive layout representation */}
                    <div className="heatmap-backdrop-page">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "24px", marginBottom: "36px" }}>
                        <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
                          ⚡ CausalStore Platform Preview
                        </span>
                        <div style={{ display: "flex", gap: "20px", fontWeight: "bold", color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--neon-cyan)" }}>Telemetry Sandbox</span>
                          <span>Analytics Arrays</span>
                          <span>Cloud Relays</span>
                        </div>
                      </div>

                      <div style={{ background: "linear-gradient(135deg, rgba(0, 245, 212, 0.05) 0%, rgba(247, 37, 133, 0.05) 100%)", border: "1px solid rgba(255,255,255,0.05)", padding: "48px", borderRadius: "20px", textAlign: "center", position: "relative" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
                          Futuristic Edge Compute Marketplace
                        </h2>
                        <p style={{ color: "var(--text-secondary)", marginTop: "12px", fontSize: "1.1rem", maxWidth: "700px", margin: "12px auto 0" }}>
                          Perform native hardware tests anywhere inside this display bounds to dispatch unscaled or responsive array coordinate indices directly across local Mongoose pipes.
                        </p>
                        <div style={{ display: "inline-block", background: "var(--neon-pink)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: 800, marginTop: "24px", boxShadow: "0 0 20px rgba(247, 37, 133, 0.4)" }}>
                          Explore Pipeline Architecture
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginTop: "36px" }}>
                        {[
                          { title: "Causal Pro Analytics Server Engine", p: "$1,299" },
                          { title: "Neural Behavior Heatmap Matrix", p: "$499" },
                          { title: "Premium Edge Session Nodes Pack", p: "$899" }
                        ].map((mock, mi) => (
                          <div key={mi} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "24px", borderRadius: "16px" }}>
                            <div style={{ height: "100px", background: "rgba(0, 245, 212, 0.05)", borderRadius: "10px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neon-cyan)", fontWeight: "bold" }}>
                              Node Block {mi + 1}
                            </div>
                            <div style={{ fontWeight: 800, color: "white", fontSize: "1.1rem" }}>{mock.title}</div>
                            <div style={{ color: "var(--neon-pink)", fontWeight: "bold", marginTop: "8px", fontSize: "1.3rem" }}>{mock.p}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Current Mapping Active: {normalizationMode === "normalized" ? "Fluid Layout Normalization via underlying responsive document matrix width." : "Raw Captured Document Surface Coordinate Pixel Coordinates."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
