import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import Papa from 'papaparse';
import { Upload, Download, Plus, Trash2, Save, AlertCircle } from 'lucide-react';

export default function CsvEditor() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('data.csv');
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV: ' + results.errors[0].message);
        } else {
          setHeaders(results.meta.fields || []);
          setData(results.data);
          setError('');
        }
      },
      error: (err) => {
        setError('Failed to parse CSV: ' + err.message);
      }
    });
  };

  const handleCellChange = (rowIndex, header, value) => {
    const newData = [...data];
    newData[rowIndex][header] = value;
    setData(newData);
  };

  const handleHeaderChange = (oldHeader, newHeader) => {
    if (!newHeader.trim() || headers.includes(newHeader)) return;
    
    const newHeaders = headers.map(h => h === oldHeader ? newHeader : h);
    const newData = data.map(row => {
      const newRow = { ...row };
      newRow[newHeader] = newRow[oldHeader];
      delete newRow[oldHeader];
      return newRow;
    });

    setHeaders(newHeaders);
    setData(newData);
  };

  const addRow = () => {
    const newRow = {};
    headers.forEach(h => newRow[h] = '');
    setData([...data, newRow]);
  };

  const deleteRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const addColumn = () => {
    const newHeader = `Column ${headers.length + 1}`;
    setHeaders([...headers, newHeader]);
    setData(data.map(row => ({ ...row, [newHeader]: '' })));
  };

  const deleteColumn = (header) => {
    setHeaders(headers.filter(h => h !== header));
    setData(data.map(row => {
      const newRow = { ...row };
      delete newRow[header];
      return newRow;
    }));
  };

  const exportCsv = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="CSV Editor"
      description="View and edit CSV files in a table format."
    >
      <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm cursor-pointer">
              <Upload size={16} />
              Open CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            {data.length > 0 && (
              <>
                <div className="h-6 w-px bg-border mx-2" />
                <button onClick={addRow} className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-sm">
                  <Plus size={14} /> Row
                </button>
                <button onClick={addColumn} className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-sm">
                  <Plus size={14} /> Column
                </button>
              </>
            )}
          </div>

          {data.length > 0 && (
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              <Save size={16} />
              Export CSV
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Table Editor */}
        {data.length > 0 ? (
          <div className="flex-grow overflow-auto border border-border rounded-lg bg-card">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  {headers.map((header) => (
                    <th key={header} className="px-4 py-3 min-w-[150px] group relative">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => handleHeaderChange(header, e.target.value)}
                        className="bg-transparent border-none focus:outline-none w-full font-bold"
                      />
                      <button
                        onClick={() => deleteColumn(header)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-red-500 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-center text-muted-foreground">{rowIndex + 1}</td>
                    {headers.map((header) => (
                      <td key={`${rowIndex}-${header}`} className="px-4 py-2">
                        <input
                          type="text"
                          value={row[header] || ''}
                          onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="p-1.5 hover:bg-red-500/10 text-red-500 rounded opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <div className="p-4 bg-muted rounded-full mb-4">
              <FileSpreadsheet size={32} />
            </div>
            <p>Upload a CSV file to start editing</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function FileSpreadsheet({ size, className }) {
    return (
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
            className={className}
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            <path d="M8 13h2"/>
            <path d="M14 13h2"/>
            <path d="M8 17h2"/>
            <path d="M14 17h2"/>
        </svg>
    )
}
