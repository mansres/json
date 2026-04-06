import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Search, ArrowUp, ArrowDown, Copy, Check } from 'lucide-react';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';

export default function JsonTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [copiedCell, setCopiedCell] = useState(null);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleCopyCell = (text, rowIdx, colIdx) => {
    navigator.clipboard.writeText(text);
    setCopiedCell(`${rowIdx}-${colIdx}`);
    setTimeout(() => setCopiedCell(null), 2000);
  };

  // Process data to array of objects for the table
  const tableData = useMemo(() => {
    if (!data) return [];
    
    // If it's already an array of objects
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object' && item !== null) return item;
        return { value: item };
      });
    }
    
    // If it's an object, convert keys to a column and values to another, 
    // OR if it's an object of objects, treat it like an array where the key is a field
    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      const isObjectOfObjects = keys.length > 0 && typeof data[keys[0]] === 'object' && data[keys[0]] !== null;
      
      if (isObjectOfObjects) {
        return keys.map(k => ({ _key: k, ...(data[k] || {}) }));
      } else {
        return keys.map(k => ({ Key: k, Value: data[k] }));
      }
    }
    
    // Primitive data
    return [{ Value: data }];
  }, [data]);

  const columns = useMemo(() => {
    if (tableData.length === 0) return [];
    const cols = new Set();
    tableData.forEach(row => {
      Object.keys(row).forEach(k => cols.add(k));
    });
    return Array.from(cols);
  }, [tableData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    const lowerTerm = searchTerm.toLowerCase();
    
    return tableData.filter(row => {
      return Object.values(row).some(val => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(lowerTerm);
      });
    });
  }, [tableData, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const handleExportExcel = () => {
    exportToExcel(filteredData, 'json_export.xlsx');
  };

  const handleExportCSV = () => {
    exportToCSV(filteredData, 'json_export.csv');
  };

  if (tableData.length === 0) {
    return (
      <div className="empty-state">
        <p>Could not convert this data structure to a table.</p>
      </div>
    );
  }

  // Format cell data with highlighting
  const renderCell = (value) => {
    if (value === null) return <span style={{color: 'var(--text-secondary)'}}>null</span>;
    if (value === undefined) return '';
    
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    if (!searchTerm) {
      if (typeof value === 'object') return <span style={{color: 'var(--accent-hover)'}}>{stringValue}</span>;
      if (typeof value === 'boolean') return <span style={{color: 'var(--success)'}}>{stringValue}</span>;
      return stringValue;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const parts = stringValue.split(new RegExp(`(${searchTerm})`, 'gi'));
    
    return (
      <span style={{ color: typeof value === 'object' ? 'var(--accent-hover)' : typeof value === 'boolean' ? 'var(--success)' : 'inherit' }}>
        {parts.map((part, i) => 
          part.toLowerCase() === lowerTerm ? (
            <mark key={i} style={{ backgroundColor: 'var(--accent-primary)', color: 'white', borderRadius: '2px', padding: '0 2px' }}>{part}</mark>
          ) : part
        )}
      </span>
    );
  };

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="search-input">
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search in table..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => requestSort(col)}
                  className="sortable-header"
                  title={`Sort by ${col}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {col}
                    {sortConfig.key === col ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUp size={14} opacity={0.2} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="table-cell">
                      <div className="cell-content">
                        <div 
                          className="cell-text" 
                          title={String(row[col])}
                        >
                          {renderCell(row[col])}
                        </div>
                        <button 
                          className="btn-icon cell-copy-btn" 
                          onClick={() => handleCopyCell(String(row[col]), rowIdx, colIdx)}
                          title="Copy cell content"
                        >
                          {copiedCell === `${rowIdx}-${colIdx}` ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Showing {sortedData.length} of {tableData.length} records
      </div>
    </div>
  );
}
