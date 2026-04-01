import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Search } from 'lucide-react';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';

export default function JsonTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');

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

  // Format cell data
  const renderCell = (value) => {
    if (value === null) return <span style={{color: 'var(--text-secondary)'}}>null</span>;
    if (value === undefined) return '';
    if (typeof value === 'object') return <span style={{color: 'var(--accent-hover)'}}>{JSON.stringify(value)}</span>;
    if (typeof value === 'boolean') return <span style={{color: 'var(--success)'}}>{value.toString()}</span>;
    return String(value);
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
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={String(row[col])}>
                      {renderCell(row[col])}
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
        Showing {filteredData.length} of {tableData.length} records
      </div>
    </div>
  );
}
