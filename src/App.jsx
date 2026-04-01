import React, { useState, useEffect } from 'react';
import { Database, Table as TableIcon, Network, LayoutDashboard, ExternalLink, FileJson, ChevronLeft, ChevronRight, Info, ShieldCheck, Cpu, Zap } from 'lucide-react';
import JsonInput from './components/JsonInput';
import JsonOverview from './components/JsonOverview';
import JsonTree from './components/JsonTree';
import JsonTable from './components/JsonTable';

const GithubIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


  useEffect(() => {
    if (!jsonInput.trim()) {
      setParsedData(null);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      setParsedData(parsed);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [jsonInput]);

  // If no parsed data, default tab should be hidden or just show empty state

  return (
    <div className={`container animate-fade-in ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="header glass-panel" style={{ padding: '0.5rem 1.5rem', border: 'none' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a
            href="https://github.com/mansres/json"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon github-link"
            title="View on GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <h1 style={{ fontSize: '1.25rem' }}>
            <FileJson size={24} />
            JSON Vision
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Action buttons could go here */}
        </div>
      </header>

      <main className="main-content">
        <aside className={`glass-panel sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isSidebarCollapsed && <span>Input JSON</span>}
              <Database size={16} color="var(--text-secondary)" />
            </div>
            <button
              className="btn-icon toggle-sidebar"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          {!isSidebarCollapsed && (
            <JsonInput
              value={jsonInput}
              onChange={setJsonInput}
              error={error}
              hasData={!!parsedData}
            />
          )}
        </aside>

        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ padding: '0.5rem 1rem' }}>
            <div className="tabs-container" style={{ margin: 0, border: 'none' }}>
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                disabled={!parsedData}
              >
                <LayoutDashboard size={16} /> Overview
              </button>
              <button
                className={`tab ${activeTab === 'tree' ? 'active' : ''}`}
                onClick={() => setActiveTab('tree')}
                disabled={!parsedData}
              >
                <Network size={16} /> Tree View
              </button>
              <button
                className={`tab ${activeTab === 'table' ? 'active' : ''}`}
                onClick={() => setActiveTab('table')}
                disabled={!parsedData}
              >
                <TableIcon size={16} /> Table View
              </button>
              <button
                className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Info size={16} /> About
              </button>
            </div>
          </div>

          <div className="viewer-content">
            {!parsedData && !error && (
              <div className="empty-state">
                <FileJson size={48} opacity={0.2} />
                <p>Paste your JSON on the left to start analyzing.</p>
              </div>
            )}

            {error && (
              <div className="empty-state" style={{ color: 'var(--danger)' }}>
                <p>Invalid JSON format.</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>{error}</p>
              </div>
            )}

            {parsedData && !error && (
              <div className="animate-fade-in">
                {activeTab === 'overview' && <JsonOverview data={parsedData} />}
                {activeTab === 'tree' && <JsonTree data={parsedData} />}
                {activeTab === 'table' && <JsonTable data={parsedData} />}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-container animate-fade-in">
                <div className="about-hero">
                  <h2>JSON Vision</h2>
                  <p>A professional toolkit for developers to visualize, analyze, and manage JSON data with zero friction.</p>
                </div>

                <div className="about-grid">
                  <div className="about-card">
                    <Zap className="card-icon" size={24} />
                    <h3>Lightning Fast</h3>
                    <p>Optimized parsing and rendering for large JSON files, providing smooth interaction regardless of complexity.</p>
                  </div>
                  <div className="about-card">
                    <ShieldCheck className="card-icon" size={24} />
                    <h3>Privacy First</h3>
                    <p>Your data stays on your machine. We process everything locally using your browser—no uploads, no tracking.</p>
                  </div>
                  <div className="about-card">
                    <Cpu className="card-icon" size={24} />
                    <h3>Power Tools</h3>
                    <p>Switch between intuitive trees, data summaries, and spreadsheet-style tables for complete data insight.</p>
                  </div>
                </div>

                <div className="about-footer">
                  <p>Created with precision by <strong>Mansoor</strong></p>
                  <a
                    href="https://github.com/mansres"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <ExternalLink size={14} /> View Developer Profile
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
