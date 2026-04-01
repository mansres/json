import React, { useMemo } from 'react';
import { Activity, Type, Layers, Box } from 'lucide-react';

export default function JsonOverview({ data }) {
  const stats = useMemo(() => {
    let nodeCount = 0;
    let maxDepth = 0;
    const types = new Set();
    let rootType = Array.isArray(data) ? 'Array' : typeof data;

    function traverse(obj, depth) {
      if (depth > maxDepth) maxDepth = depth;
      if (obj === null) {
        types.add('null');
        return;
      }
      
      const type = Array.isArray(obj) ? 'array' : typeof obj;
      types.add(type);
      
      if (type === 'object' || type === 'array') {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          nodeCount++;
          traverse(obj[keys[i]], depth + 1);
        }
      }
    }

    if (data !== null && typeof data === 'object') {
      traverse(data, 1);
    } else {
      types.add(typeof data);
      nodeCount = 1;
      maxDepth = 0;
    }

    return {
      nodeCount,
      maxDepth,
      types: Array.from(types).join(', '),
      rootType,
      size: Array.isArray(data) ? data.length : Object.keys(data || {}).length
    };
  }, [data]);

  return (
    <div className="overview-container">
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.125rem' }}>Overview Metrics</h2>
      <div className="overview-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Root Type</span>
            <Box size={16} color="var(--accent-primary)" />
          </div>
          <span className="stat-value">{stats.rootType}</span>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">{stats.rootType === 'Array' ? 'Items' : 'Properties'}</span>
            <Layers size={16} color="var(--accent-hover)" />
          </div>
          <span className="stat-value">{stats.size}</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Nodes</span>
            <Activity size={16} color="var(--success)" />
          </div>
          <span className="stat-value">{stats.nodeCount}</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Max Depth</span>
            <NetworkIcon />
          </div>
          <span className="stat-value">{stats.maxDepth}</span>
        </div>
      </div>
    </div>
  );
}

function NetworkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--json-boolean)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="16" width="6" height="6" rx="1"/>
      <rect x="2" y="16" width="6" height="6" rx="1"/>
      <rect x="9" y="2" width="6" height="6" rx="1"/>
      <path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>
      <path d="M12 8v3"/>
    </svg>
  );
}
