import { useRef, useEffect, useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import Papa from 'papaparse';
import { ArrowLeftRight, Copy, Check, Upload, Trash2, FileJson, FileSpreadsheet, Download, Table, Loader2 } from 'lucide-react';

const MAX_DISPLAY_LENGTH = 50000; // 50KB

export default function CsvJsonConverter() {
  const [displayInput, setDisplayInput] = useState('');
  const [displayOutput, setDisplayOutput] = useState('');
  const [mode, setMode] = useState('csv2json'); // csv2json or json2csv
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [excelCopied, setExcelCopied] = useState(false);
  
  const fullOutputRef = useRef('');
  const fullInputRef = useRef('');

  const updateInput = (text) => {
    fullInputRef.current = text;
    if (text.length > MAX_DISPLAY_LENGTH) {
      setDisplayInput(text.substring(0, MAX_DISPLAY_LENGTH) + '\n... (Input truncated for performance)');
    } else {
      setDisplayInput(text);
    }
  };

  const updateOutput = (text) => {
    fullOutputRef.current = text;
    if (text.length > MAX_DISPLAY_LENGTH) {
      setDisplayOutput(text.substring(0, MAX_DISPLAY_LENGTH) + '\n... (Output truncated for performance)');
    } else {
      setDisplayOutput(text);
    }
  };

  const convert = (value = fullInputRef.current) => {
    setError('');
    if (!value.trim()) {
      updateOutput('');
      return;
    }

    setLoading(true);

    // Small timeout to allow UI to update loading state
    setTimeout(() => {
        try {
          if (mode === 'csv2json') {
            Papa.parse(value, {
              header: true,
              skipEmptyLines: true,
              worker: true, // Use worker for large files
              complete: (results) => {
                setLoading(false);
                if (results.errors.length > 0 && results.data.length === 0) {
                  setError('Error parsing CSV: ' + results.errors[0].message);
                } else {
                  if (results.errors.length > 0) {
                      console.warn('CSV Parse Warnings:', results.errors);
                  }
                  const json = JSON.stringify(results.data, null, 2);
                  updateOutput(json);
                }
              },
              error: (err) => {
                setLoading(false);
                setError('Failed to parse CSV: ' + err.message);
              }
            });
          } else {
            // JSON to CSV
            try {
                const jsonData = JSON.parse(value);
                const csv = Papa.unparse(jsonData);
                updateOutput(csv);
            } catch (e) {
                setError('Invalid JSON: ' + e.message);
            }
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          setError('Conversion failed: ' + err.message);
        }
    }, 10);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    fullInputRef.current = value;
    if (value.length > MAX_DISPLAY_LENGTH) {
      setDisplayInput(value.substring(0, MAX_DISPLAY_LENGTH) + '\n... (Input truncated for performance)');
    } else {
      setDisplayInput(value);
    }
    convert(value);
  };

  const switchMode = () => {
    setMode(prev => prev === 'csv2json' ? 'json2csv' : 'csv2json');

    const currentInput = fullInputRef.current;
    const currentOutput = fullOutputRef.current;

    updateInput(currentOutput);
    updateOutput(currentInput);
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      fullInputRef.current = text;
      if (text.length > MAX_DISPLAY_LENGTH) {
        setDisplayInput(text.substring(0, MAX_DISPLAY_LENGTH) + '\n... (Input truncated for performance)');
      } else {
        setDisplayInput(text);
      }
      convert(text);
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullOutputRef.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyForExcel = async () => {
    try {
      let textToCopy = fullOutputRef.current;
      
      // If output is JSON, parse it and convert to TSV
      // If output is CSV, parse it and convert to TSV
      // Ideally we use the source data to generate TSV
      
      let dataToConvert = null;

      if (mode === 'csv2json') {
        // Output is JSON
        try {
            dataToConvert = JSON.parse(fullOutputRef.current);
        } catch (e) { /* ignore */ }
      } else {
        // Output is CSV, parse it back to get data
        Papa.parse(fullOutputRef.current, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                dataToConvert = results.data;
            }
        });
      }

      if (dataToConvert) {
          textToCopy = Papa.unparse(dataToConvert, {
              delimiter: '\t',
              newline: '\r\n'
          });
      }

      await navigator.clipboard.writeText(textToCopy);
      setExcelCopied(true);
      setTimeout(() => setExcelCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy for excel', err);
    }
  };

  const handleDownload = () => {
    if (!fullOutputRef.current) return;
    
    const extension = mode === 'csv2json' ? 'json' : 'csv';
    const type = mode === 'csv2json' ? 'application/json' : 'text/csv';
    
    const blob = new Blob([fullOutputRef.current], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="CSV <-> JSON Converter"
      description="Convert data between CSV and JSON formats."
    >
      <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={switchMode}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors font-medium text-sm disabled:opacity-50"
            >
              <ArrowLeftRight size={16} />
              {mode === 'csv2json' ? 'CSV to JSON' : 'JSON to CSV'}
            </button>
            
            <label className={`flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors text-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <Upload size={14} />
              Upload File
              <input
                type="file"
                accept={mode === 'csv2json' ? '.csv' : '.json'}
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => { updateInput(''); updateOutput(''); setError(''); }}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors text-sm disabled:opacity-50"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-4 flex-grow">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground px-1">
              {mode === 'csv2json' ? <FileSpreadsheet size={16} /> : <FileJson size={16} />}
              {mode === 'csv2json' ? 'CSV Input' : 'JSON Input'}
            </div>
            <textarea
              value={displayInput}
              onChange={handleInputChange}
              placeholder={mode === 'csv2json' ? 'Paste CSV here...' : 'Paste JSON here...'}
              className="flex-grow p-4 bg-card border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary resize-none"
              spellCheck="false"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {mode === 'csv2json' ? <FileJson size={16} /> : <FileSpreadsheet size={16} />}
                {mode === 'csv2json' ? 'JSON Output' : 'CSV Output'}
              </div>
              <button
                onClick={handleCopy}
                disabled={!fullOutputRef.current || loading}
                className="flex items-center gap-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleCopyForExcel}
                disabled={!fullOutputRef.current || loading}
                className="flex items-center gap-2 px-2 py-1 text-xs font-medium bg-green-600/10 text-green-600 hover:bg-green-600/20 rounded transition-colors disabled:opacity-50"
                title="Copy as Tab-Separated Values for Excel"
              >
                {excelCopied ? <Check size={12} /> : <Table size={12} />}
                {excelCopied ? 'Copied!' : 'Copy for Excel'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!fullOutputRef.current || loading}
                className="flex items-center gap-2 px-2 py-1 text-xs font-medium bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 rounded transition-colors disabled:opacity-50"
              >
                <Download size={12} />
                Download
              </button>
            </div>
            <div className="relative flex-grow">
              {loading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Loader2 className="animate-spin" />
                        Processing...
                    </div>
                </div>
              )}
              <textarea
                value={displayOutput}
                readOnly
                placeholder="Result will appear here..."
                className={`w-full h-full p-4 bg-card border border-border rounded-lg font-mono text-sm focus:outline-none resize-none ${error ? 'border-red-500/50' : ''}`}
              />
              {error && (
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
