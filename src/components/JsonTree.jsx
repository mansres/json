import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const JsonValue = ({ value }) => {
  if (value === null) return <span className="tree-null">null</span>;
  if (typeof value === 'boolean') return <span className="tree-boolean">{value.toString()}</span>;
  if (typeof value === 'number') return <span className="tree-number">{value}</span>;
  if (typeof value === 'string') return <span className="tree-string">"{value}"</span>;
  
  // Empty arrays and objects
  if (Array.isArray(value) && value.length === 0) return <span>[]</span>;
  if (typeof value === 'object' && Object.keys(value).length === 0) return <span>{'{ }'}</span>;
  
  return null;
};

const TreeNode = ({ name, value, isLast, root }) => {
  const [expanded, setExpanded] = useState(root);
  const isExpandable = value !== null && typeof value === 'object' && Object.keys(value).length > 0;
  
  const handleToggle = () => {
    if (isExpandable) setExpanded(!expanded);
  };
  
  const isArray = Array.isArray(value);

  return (
    <div className="tree-node">
      <div style={{ display: 'flex' }}>
        {isExpandable ? (
          <span className="tree-toggle" onClick={handleToggle}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        ) : (
          <span style={{ width: '16px', marginRight: '4px', display: 'inline-block' }}></span>
        )}
        
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {name && (
            <span 
              className={`tree-key ${isExpandable ? 'expandable' : ''}`} 
              onClick={handleToggle}
              style={{ marginRight: '0.5rem' }}
            >
              {name}:
            </span>
          )}
          
          {!isExpandable && (
            <span>
              <JsonValue value={value} />
              {!isLast && <span>,</span>}
            </span>
          )}

          {isExpandable && (
            <span>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {isArray ? '[' : '{'}
              </span>
              {!expanded && (
                <span onClick={handleToggle} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {' '}...{' '}
                  {isArray ? `] (${value.length} items)` : `} (${Object.keys(value).length} keys)`}
                  {!isLast && <span>,</span>}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {isExpandable && expanded && (
        <>
          <div style={{ marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            {isArray ? (
              value.map((item, index) => (
                <TreeNode 
                  key={index} 
                  value={item} 
                  isLast={index === value.length - 1} 
                  root={false}
                />
              ))
            ) : (
              Object.entries(value).map(([key, val], index, arr) => (
                <TreeNode 
                  key={key} 
                  name={`"${key}"`} 
                  value={val} 
                  isLast={index === arr.length - 1}
                  root={false}
                />
              ))
            )}
          </div>
          <div style={{ paddingLeft: '20px' }}>
            <span>{isArray ? ']' : '}'}</span>
            {!isLast && <span>,</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default function JsonTree({ data }) {
  return (
    <div className="json-tree">
      <TreeNode name={null} value={data} isLast={true} root={true} />
    </div>
  );
}
