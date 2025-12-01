import React, { useState, useEffect, useRef, useCallback } from 'react';
import ToolLayout from '../components/ToolLayout';
import SpreadsheetEditor from '../components/SpreadsheetEditor';
import SqlOptionsPanel from '../components/SqlOptionsPanel';
import { generateSql } from '../utils/sqlGenerator';
import Papa from 'papaparse';
import { 
  Undo, Redo, ArrowLeftRight, Trash2, Eraser, Copy, 
  Type, CaseUpper, CaseLower, Upload, FileSpreadsheet, Download, Check 
} from 'lucide-react';

export default function CsvSqlTool() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [sqlOptions, setSqlOptions] = useState({
    dialect: 'mysql',
    tableName: 'my_table',
    primaryKey: '',
    dropTable: false
  });
  const [sqlPreview, setSqlPreview] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullSqlCopied, setFullSqlCopied] = useState(false);

  // Initial load or reset - Generate Preview Only
  useEffect(() => {
    if (data.length > 0) {
      if (data.length > 50) {
        // For large datasets, use first 50 rows for type inference but ONLY generate structure
        const previewData = data.slice(0, 50);
        const structureSql = generateSql(previewData, headers, { ...sqlOptions, onlyStructure: true });
        setSqlPreview(structureSql + `-- Data too large for preview (${data.length} rows).\n-- Please download the .sql file to view all INSERT statements.`);
      } else {
        const generated = generateSql(data, headers, sqlOptions);
        setSqlPreview(generated);
      }
    } else {
        setSqlPreview('');
    }
  }, [data, headers, sqlOptions]);

  const addToHistory = useCallback((newData, newHeaders) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ data: newData, headers: newHeaders });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUpdate = (newData, newHeaders) => {
    setData(newData);
    setHeaders(newHeaders);
    addToHistory(newData, newHeaders);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setData(prevState.data);
      setHeaders(prevState.headers);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setData(nextState.data);
      setHeaders(nextState.headers);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileInput = e.target;
    if (!file) return;

    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true, // Offload to worker
      complete: (results) => {
        setIsProcessing(false);
        if (results.data && results.data.length > 0) {
          const newHeaders = results.meta.fields || Object.keys(results.data[0]);
          setData(results.data);
          setHeaders(newHeaders);
          
          // Reset history
          setHistory([{ data: results.data, headers: newHeaders }]);
          setHistoryIndex(0);
          
          // Auto-set table name from filename
          const tableName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_");
          setSqlOptions(prev => ({ ...prev, tableName }));
        }
        // Reset input value to allow re-uploading the same file
        fileInput.value = null;
      },
      error: (err) => {
        setIsProcessing(false);
        console.error("CSV Parse Error:", err);
        alert("Failed to parse CSV file.");
      }
    });
  };

  const handleDownloadSql = () => {
    if (data.length === 0) return;
    setIsProcessing(true);
    // Defer to allow UI to update
    setTimeout(() => {
        const fullSql = generateSql(data, headers, sqlOptions);
        const blob = new Blob([fullSql], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sqlOptions.tableName || 'data'}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsProcessing(false);
    }, 100);
  };

  const handleCopyFullSql = async () => {
    if (data.length === 0) return;
    setIsProcessing(true);
    setTimeout(async () => {
        const fullSql = generateSql(data, headers, sqlOptions);
        try {
            await navigator.clipboard.writeText(fullSql);
            setFullSqlCopied(true);
            setTimeout(() => setFullSqlCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
        setIsProcessing(false);
    }, 100);
  };

  // Toolbar Actions
  const handleTranspose = () => {
    if (data.length === 0) return;
    if (data.length > 100) {
        alert("Transpose is limited to 100 rows for performance.");
        return;
    }

    const newHeaders = ['Field', ...data.map((_, i) => `Row_${i + 1}`)];
    const newData = headers.map(header => {
        const row = { Field: header };
        data.forEach((d, i) => {
            row[`Row_${i + 1}`] = d[header];
        });
        return row;
    });

    handleUpdate(newData, newHeaders);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all data?")) {
        handleUpdate([], []);
    }
  };

  const handleDeleteEmpty = () => {
    const newData = data.filter(row => {
        return Object.values(row).some(val => val !== null && val !== '' && val !== undefined);
    });
    handleUpdate(newData, headers);
  };

  const handleDeduplicate = () => {
    const seen = new Set();
    const newData = data.filter(row => {
        const str = JSON.stringify(row);
        if (seen.has(str)) return false;
        seen.add(str);
        return true;
    });
    handleUpdate(newData, headers);
  };

  const handleCase = (type) => {
    const newData = data.map(row => {
        const newRow = { ...row };
        headers.forEach(h => {
            if (typeof newRow[h] === 'string') {
                if (type === 'upper') newRow[h] = newRow[h].toUpperCase();
                if (type === 'lower') newRow[h] = newRow[h].toLowerCase();
                if (type === 'capitalize') newRow[h] = newRow[h].charAt(0).toUpperCase() + newRow[h].slice(1).toLowerCase();
            }
        });
        return newRow;
    });
    handleUpdate(newData, headers);
  };

  return (
    <ToolLayout
      title="CSV to SQL Converter"
      description="Convert CSV data to SQL INSERT statements with an editable spreadsheet."
    >
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 relative">
        {isProcessing && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-card p-4 rounded-lg shadow-lg border border-border flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>Processing...</span>
                </div>
            </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-card border border-border rounded-lg overflow-x-auto flex-shrink-0">
          <div className="flex items-center gap-1 pr-2 border-r border-border">
              <input id="csv-sql-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <label htmlFor="csv-sql-upload" className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors cursor-pointer text-sm font-medium">
                <Upload size={14} />
                Upload CSV
              </label>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-border">
            <button onClick={handleUndo} disabled={historyIndex <= 0} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-50 text-xs font-medium" title="Undo">
              <Undo size={14} />
              Undo
            </button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-50 text-xs font-medium" title="Redo">
              <Redo size={14} />
              Redo
            </button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-border">
            <button onClick={handleTranspose} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs font-medium" title="Transpose">
              <ArrowLeftRight size={14} />
              Transpose
            </button>
            <button onClick={handleDeduplicate} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs font-medium" title="Deduplicate">
              <Copy size={14} />
              Deduplicate
            </button>
            <button onClick={handleDeleteEmpty} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs font-medium" title="Delete Empty Rows">
              <Eraser size={14} />
              Delete Empty
            </button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-border">
            <button onClick={() => handleCase('upper')} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs font-medium" title="UPPERCASE">
              <CaseUpper size={14} />
              UPPER
            </button>
            <button onClick={() => handleCase('lower')} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs font-medium" title="lowercase">
              <CaseLower size={14} />
              lower
            </button>
            <button onClick={() => handleCase('capitalize')} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs font-medium" title="Capitalize">
              <Type size={14} />
              Capitalize
            </button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button onClick={handleClear} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-red-500/10 text-red-500 rounded text-xs font-medium" title="Clear All">
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-grow gap-4 overflow-hidden min-h-0">
          {/* Left: Editor */}
          <div className="flex-grow overflow-hidden flex flex-col">
            <SpreadsheetEditor 
              data={data} 
              headers={headers} 
              onUpdate={handleUpdate}
              onSelectionChange={setSelectedCells}
            />
          </div>

          {/* Right: SQL Panel */}
          <SqlOptionsPanel 
            options={sqlOptions} 
            onOptionsChange={setSqlOptions} 
            headers={headers}
            sql={sqlPreview}
          />
        </div>
        
        {/* SQL Preview (Bottom) */}
        <div className="h-48 border border-border rounded-lg bg-card flex flex-col relative flex-shrink-0">
            <div className="p-2 border-b border-border text-xs font-semibold text-muted-foreground bg-muted/30 flex justify-between items-center">
                <span>{data.length > 50 ? 'SQL Preview (Structure Only)' : 'SQL Preview'}</span>
                <div className="flex items-center gap-2">
                    {data.length > 50 && (
                        <span className="text-amber-500 text-xs mr-2">
                            Data too large to preview. Please download .sql file.
                        </span>
                    )}
                    <button 
                        onClick={handleDownloadSql}
                        className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs transition-colors"
                    >
                        <Download size={12} />
                        Download .sql
                    </button>
                </div>
            </div>
            <textarea 
                value={sqlPreview} 
                readOnly 
                className="flex-grow p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
            />
        </div>
      </div>
    </ToolLayout>
  );
}
