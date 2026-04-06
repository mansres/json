import React from 'react';
import { AlignLeft, Trash2, Copy, Download, Minimize2 } from 'lucide-react';

export default function JsonInput({ value, onChange, error, hasData, onToast }) {
  const handleFormat = () => {
    try {
      if (!value) return;
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      if (onToast) onToast('Cannot format invalid JSON', 'danger');
    }
  };

  const handleMinify = () => {
    try {
      if (!value) return;
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed));
      if (onToast) onToast('JSON Minified');
    } catch (e) {
      if (onToast) onToast('Cannot minify invalid JSON', 'danger');
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    if (onToast) onToast('JSON copied to clipboard');
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    if (onToast) onToast('Downloading JSON file...');
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
          title="Minify JSON" 
          onClick={handleMinify}
          disabled={!hasData || !!error}
        >
          <Minimize2 size={16} />
        </button>
        <button 
          className="btn-icon" 
          title="Copy JSON" 
          onClick={handleCopy}
          disabled={!value}
        >
          <Copy size={16} />
        </button>
        <button 
          className="btn-icon" 
          title="Download JSON" 
          onClick={handleDownload}
          disabled={!value}
        >
          <Download size={16} />
        </button>
        <button 
          className="btn-icon" 
          title="Clear" 
          onClick={handleClear}
          disabled={!value}
          style={{ marginLeft: 'auto' }}
        >
          <Trash2 size={16} />
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
