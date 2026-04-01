import React from 'react';
import { AlignLeft, Trash2 } from 'lucide-react';

export default function JsonInput({ value, onChange, error, hasData }) {
  const handleFormat = () => {
    try {
      if (!value) return;
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Ignored: cannot format invalid JSON
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="json-input-wrapper">
      <div className="toolbar" style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.1)' }}>
        <button 
          className="btn-icon" 
          title="Format JSON" 
          onClick={handleFormat}
          disabled={!hasData || !!error}
        >
          <AlignLeft size={16} /> <span style={{fontSize: '0.75rem', marginLeft: '0.5rem'}}>Format</span>
        </button>
        <button 
          className="btn-icon" 
          title="Clear" 
          onClick={handleClear}
          disabled={!value}
        >
          <Trash2 size={16} /> <span style={{fontSize: '0.75rem', marginLeft: '0.5rem'}}>Clear</span>
        </button>
      </div>
      
      <textarea
        className="json-textarea"
        placeholder="Paste your JSON here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
      />
      
      <div className="status-bar">
        <span>Status:</span>
        {value === '' ? (
          <span style={{color: 'var(--text-secondary)'}}>Waiting for input...</span>
        ) : error ? (
          <span className="status-invalid">Invalid JSON</span>
        ) : (
          <span className="status-valid">Valid JSON</span>
        )}
      </div>
    </div>
  );
}
