"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DemoPage() {
  const [clickLog, setClickLog] = useState(null);

  // Live demonstration click interception to render a premium interactive flash indicator
  const handlePageInteraction = (e) => {
    setClickLog({
      x: e.pageX,
      y: e.pageY,
      time: new Date().toLocaleTimeString()
    });
  };

  const products = [
    { id: 1, name: "Causal Pro Analytics Server Engine", price: "$1,299", category: "Hardware Matrix", icon: "⚡" },
    { id: 2, name: "Neural Behavior Heatmap Overlay", price: "$499", category: "Software Engine", icon: "🧠" },
    { id: 3, name: "Premium Edge Session Nodes Pack", price: "$899", category: "Cloud Pipeline", icon: "🛰️" },
    { id: 4, name: "Ergonomic Telemetry Trackpad", price: "$199", category: "Input Pulsar", icon: "🖱️" },
  ];

  // Reusable stagger engine for modern card staggers
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  return (
    <div className="mordern-demo-wrapper" onClick={handlePageInteraction}>
      {/* Client-Side Event Tracker Integration */}
      <Script src="/tracker.js" strategy="afterInteractive" />

      {/* Persistent floating dynamic feedback module */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="tracker-badge-floating"
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--neon-cyan)", boxShadow: "0 0 12px var(--neon-cyan)", animation: "pulseNeonDot 1.5s infinite" }} />
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Telemetry Script</div>
          <div style={{ color: "white", fontSize: "0.95rem" }}>● Autonomous Ingestion</div>
          {clickLog && (
            <motion.div 
              key={clickLog.time}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: "0.8rem", color: "var(--neon-pink)", marginTop: "4px", fontWeight: "bold", fontFamily: "monospace" }}
            >
              Captured X:{clickLog.x} Y:{clickLog.y}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation Header */}
      <nav className="navbar" style={{ background: "rgba(11, 15, 25, 0.9)" }}>
        <div className="logo-brand">
          <div className="logo-icon" style={{ background: "var(--neon-cyan)", color: "#0a0e17" }}>⚡</div>
          <span style={{ color: "white" }}>CausalStore <span style={{ fontWeight: 300, color: "var(--neon-cyan)" }}>Telemetry Nodes</span></span>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600 }}>
          Click anywhere across layout bounds to dispatch real-time pipeline coordinate arrays
        </div>
        <div>
          <Link href="/" className="btn-premium" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", boxShadow: "none" }}>
            <span>← Back to Engine</span>
          </Link>
        </div>
      </nav>

      {/* Premium Hero block */}
      <div className="demo-hero-section">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="demo-pill"
        >
          Live Interactive Framework Sandbox
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: "3.5rem", fontWeight: 900, color: "white", letterSpacing: "-0.03em", maxWidth: "900px", margin: "0 auto", lineHeight: 1.1 }}
        >
          Futuristic Edge Computing Marketplace
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "700px", margin: "16px auto 0", fontWeight: 500 }}
        >
          Every initial component execution records initial browser fingerprints. Interacting on product tracks stream ultra-precise bounding indices directly to localized Mongoose cloud daemons.
        </motion.p>

        {/* Feature Triggers */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "36px" }}
        >
          <button style={{ background: "var(--neon-cyan)", color: "#0a0e17", padding: "12px 28px", borderRadius: "12px", border: "none", fontWeight: 800, cursor: "pointer", boxShadow: "0 0 20px rgba(0, 245, 212, 0.3)" }}>
            ⚡ Live High-Speed Nodes
          </button>
          <button style={{ background: "rgba(255,255,255,0.05)", color: "white", padding: "12px 28px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 700, cursor: "pointer" }}>
            🧠 Cloud Neural Pipelines
          </button>
        </motion.div>
      </div>

      {/* Spring Animated Products Grid Matrix */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="demo-grid-cards"
      >
        {products.map((prod) => (
          <motion.div 
            key={prod.id} 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="framer-card-mordern"
          >
            <div>
              <div className="card-icon-wrapper">
                {prod.icon}
              </div>
              <div className="card-category-mordern">
                {prod.category}
              </div>
              <h3 className="card-title-mordern">
                {prod.name}
              </h3>
              <div className="card-price-mordern">
                {prod.price}
              </div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.96 }}
              className="card-btn-mordern"
              onClick={(e) => {
                // Natural bubble path logic to invoke telemetry layer gracefully
                console.log(`Payload tracked for item index: ${prod.id}`);
              }}
            >
              <span>Simulate Checkout Stream</span>
              <span>→</span>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Support Simulation block */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ maxWidth: "1200px", margin: "80px auto 0", background: "rgba(22, 28, 45, 0.4)", border: "1px solid rgba(255,255,255,0.06)", padding: "48px", borderRadius: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}
      >
        <div>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "white" }}>Inspect Chronological Heatmaps</h3>
          <p style={{ color: "var(--text-secondary)", marginTop: "6px", fontSize: "1.05rem" }}>Verify instant multi-mode responsive tracking data matrices on the main analytics portal.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input 
            type="email" 
            placeholder="Enter tracking tag parameters..." 
            style={{ background: "rgba(0,0,0,0.4)", padding: "14px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", outline: "none", color: "white", width: "280px" }}
          />
          <button style={{ background: "var(--neon-pink)", color: "white", border: "none", padding: "0 24px", borderRadius: "12px", fontWeight: 800, cursor: "pointer", boxShadow: "0 0 20px rgba(247, 37, 133, 0.4)" }}>
            Relay Index
          </button>
        </div>
      </motion.div>
    </div>
  );
}
