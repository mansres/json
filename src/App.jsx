import React, { useState, useEffect } from 'react';
import { Database, Table as TableIcon, Network, LayoutDashboard, ExternalLink, FileJson } from 'lucide-react';
import JsonInput from './components/JsonInput';
import JsonOverview from './components/JsonOverview';
import JsonTree from './components/JsonTree';
import JsonTable from './components/JsonTable';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="container animate-fade-in">
      <header className="header glass-panel" style={{ padding: '1.5rem 2rem', border: 'none' }}>
        <h1>
          <FileJson size={28} />
          JSON Visualizer
        </h1>
        {/* <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="https://github.com/mansres/json" target="_blank" rel="noopener noreferrer" className="btn-icon" title="View on GitHub">
            <ExternalLink size={20} />
          </a>
        </div> */}
      </header>

      <main className="main-content">
        <aside className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <span>Input JSON</span>
            <Database size={16} color="var(--text-secondary)" />
          </div>
          <JsonInput
            value={jsonInput}
            onChange={setJsonInput}
            error={error}
            hasData={!!parsedData}
          />
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
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
