import React, { useState } from "react";
import OpportunityFinder from "./components/OpportunityFinder";
import PageBuilder from "./components/PageBuilder";
import SeoDashboard from "./Pages/SeoDashboard";   // ✅ make sure this path is correct
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("finder");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`app-root ${darkMode ? "dark" : ""}`}>
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">
            <span>TP</span>
          </div>
          <div>
            <h1>TilePlan SEO Portal</h1>
            <p className="brand-subtitle">
              Internal tool for SEO opportunity finding &amp; WordPress page building
            </p>
          </div>
        </div>

        <div className="header-right">
          <div className="header-image-wrapper">
            <img
              src="https://via.placeholder.com/360x130.png?text=Industrial+%26+Commercial+Flooring"
              alt="Industrial and commercial flooring visual"
              className="header-image"
            />
          </div>

          <button
            type="button"
            className="mode-toggle"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* 🚫 remove any old standalone “SEO Competitor Dashboard” button here */}

      {/* Step strip */}
      <section className="intro-strip">
        <div className="intro-pill">
          <span className="intro-emoji">1️⃣</span>
          <span>Find SEO gaps vs competitors</span>
        </div>
        <div className="intro-pill">
          <span className="intro-emoji">2️⃣</span>
          <span>Generate optimised TilePlan page content</span>
        </div>
        <div className="intro-pill">
          <span className="intro-emoji">3️⃣</span>
          <span>Export or send to WordPress as a draft</span>
        </div>
      </section>

      <main className="app-main">
        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === "finder" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("finder")}
          >
            🔍 SEO Opportunity Finder
          </button>
          <button
            className={`tab-btn ${activeTab === "builder" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("builder")}
          >
            📝 SEO Page Builder
          </button>
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 SEO Competitor Dashboard
          </button>
        </nav>

        <section className="tab-content">
          <div
            className={`tab-panel ${
              activeTab === "finder" ? "tab-panel-active" : "tab-panel-hidden"
            }`}
          >
            <OpportunityFinder />
          </div>

          <div
            className={`tab-panel ${
              activeTab === "builder" ? "tab-panel-active" : "tab-panel-hidden"
            }`}
          >
            <PageBuilder />
          </div>

          <div
            className={`tab-panel ${
              activeTab === "dashboard" ? "tab-panel-active" : "tab-panel-hidden"
            }`}
          >
            <SeoDashboard />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>TilePlan · Group 26 · Sprint 2 (Front-end UI prototype)</p>
      </footer>
    </div>
  );
}

export default App;
