import React, { useState, useEffect, useRef } from 'react';
import ToolLayout from '../components/ToolLayout';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Terminal, Loader2, AlertCircle, Maximize2, Minimize2, LayoutTemplate } from 'lucide-react';

const LANGUAGES = [
  { id: 'web', name: 'Web (HTML/CSS/JS)', defaultCode: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 20px; }\n    h1 { color: #3b82f6; }\n    button { padding: 10px 20px; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Hello Web!</h1>\n  <p>Click the button to log to console.</p>\n  <button onclick="logMessage()">Click Me</button>\n\n  <script>\n    function logMessage() {\n      console.log("Button clicked at " + new Date().toLocaleTimeString());\n    }\n    console.log("Page loaded!");\n  </script>\n</body>\n</html>' },
  { id: 'csharp', name: 'C# (Mono)', defaultCode: 'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine("Hello from C#!");\n    }\n}' },
  { id: 'python', name: 'Python (Pyodide)', defaultCode: 'print("Hello from Python!")\n\ndef factorial(n):\n    if n == 0: return 1\n    return n * factorial(n-1)\n\nprint(f"5! = {factorial(5)}")' },
  { id: 'javascript', name: 'JavaScript (Node/Browser)', defaultCode: 'console.log("Hello from JavaScript!");\n\nconst sum = (a, b) => a + b;\nconsole.log(`2 + 3 = ${sum(2, 3)}`);' },
  { id: 'cpp', name: 'C++ (GCC)', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
  { id: 'go', name: 'Go', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}' },
  { id: 'rust', name: 'Rust', defaultCode: 'fn main() {\n    println!("Hello from Rust!");\n}' },
  { id: 'typescript', name: 'TypeScript', defaultCode: 'interface User {\n  name: string;\n  id: number;\n}\n\nconst user: User = {\n  name: "Hayes",\n  id: 0,\n};\n\nconsole.log(`Hello, ${user.name}!`);' },
  { id: 'php', name: 'PHP', defaultCode: '<?php\n\necho "Hello from PHP!";\n\nfunction fib($n) {\n    if ($n < 2) return $n;\n    return fib($n-1) + fib($n-2);\n}\n\necho "\\nFib(10): " . fib(10);' },
  { id: 'ruby', name: 'Ruby', defaultCode: 'puts "Hello from Ruby!"\n\n5.times do |i|\n  puts "Count: #{i}"\nend' },
  { id: 'swift', name: 'Swift', defaultCode: 'print("Hello from Swift!")\n\nlet numbers = [1, 2, 3, 4, 5]\nlet doubled = numbers.map { $0 * 2 }\nprint("Doubled: \\(doubled)")' },
  { id: 'kotlin', name: 'Kotlin', defaultCode: 'fun main() {\n    println("Hello from Kotlin!")\n    \n    val list = listOf("a", "b", "c")\n    println("List: $list")\n}' },
];

export default function OnlineCompiler() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  
  // Panel expansion states
  const [expandedPanel, setExpandedPanel] = useState(null); // 'editor', 'output', or null

  // Load Pyodide on mount if not already loaded
  useEffect(() => {
    const loadPyodideInstance = async () => {
      if (!window.loadPyodide) {
        try {
            const { loadPyodide } = await import('pyodide');
            setPyodideLoading(true);
            const pyodideInstance = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/"
            });
            setPyodide(pyodideInstance);
            setPyodideLoading(false);
        } catch (e) {
            console.error("Failed to load Pyodide:", e);
            setOutput(prev => prev + `\n[System] Failed to load Python runtime: ${e.message}`);
        }
      }
    };
    
    loadPyodideInstance();
  }, []);

  // Theme state
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  // Sync theme with app
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? 'vs-dark' : 'light');
    };

    // Initial check
    updateTheme();

    // Watch for class changes on html element
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console-log') {
        setOutput(prev => prev + event.data.message + '\n');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLanguageChange = (langId) => {
    const lang = LANGUAGES.find(l => l.id === langId);
    setLanguage(lang);
    setCode(lang.defaultCode);
    setOutput('');
    setIframeSrc('');
  };

  const runPiston = async (lang, sourceCode) => {
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          version: '*',
          files: [{ content: sourceCode }]
        })
      });
      const data = await response.json();
      if (data.run) {
        return data.run.output;
      } else {
        return `Error: ${data.message || 'Unknown error'}`;
      }
    } catch (e) {
      return `Network Error: ${e.message}`;
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    if (language.id !== 'web') setOutput(''); // Clear previous output for non-web

    try {
      if (language.id === 'web') {
        setOutput(''); // Clear output
        // Inject console capture script
        const script = `
          <script>
            (function() {
              const oldLog = console.log;
              console.log = function(...args) {
                oldLog.apply(console, args);
                window.parent.postMessage({
                  type: 'console-log',
                  message: args.map(a => String(a)).join(' ')
                }, '*');
              };
              const oldError = console.error;
              console.error = function(...args) {
                oldError.apply(console, args);
                window.parent.postMessage({
                  type: 'console-log',
                  message: '[Error] ' + args.map(a => String(a)).join(' ')
                }, '*');
              };
            })();
          </script>
        `;
        // Combine script and code
        const blob = new Blob([script + code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setIframeSrc(url);
      } else if (language.id === 'python') {
        if (!pyodide) {
          setOutput('Python runtime is still loading... please wait.');
          setIsRunning(false);
          return;
        }
        // Redirect stdout
        pyodide.setStdout({ batched: (msg) => setOutput(prev => prev + msg + '\n') });
        try {
            await pyodide.runPythonAsync(code);
        } catch (err) {
            setOutput(prev => prev + `\nError:\n${err}`);
        }
      } else if (language.id === 'javascript') {
        // Capture console.log
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map(a => String(a)).join(' '));
        };
        try {
            const func = new Function(code);
            func();
        } catch (e) {
            logs.push(`Error: ${e.message}`);
        } finally {
            console.log = originalLog;
            setOutput(logs.join('\n'));
        }
      } else {
        // Use Piston for others
        const result = await runPiston(language.id, code);
        setOutput(result);
      }
    } catch (err) {
        setOutput(`System Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleExpand = (panel) => {
    if (expandedPanel === panel) {
      setExpandedPanel(null);
    } else {
      setExpandedPanel(panel);
    }
  };

  return (
    <ToolLayout
      title="Online Compiler"
      description="Compile and run code in various languages directly in your browser."
    >
      <div className="flex flex-col h-[calc(100vh-200px)] gap-4">
        {/* Controls */}
        <div className="flex justify-between items-center bg-card p-2 rounded-md border border-border">
          <div className="flex items-center gap-4">
            <select
              value={language.id}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {LANGUAGES.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {language.id === 'python' && pyodideLoading && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading Pyodide...
                </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOutput('')}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              title="Clear Output"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={runCode}
              disabled={isRunning || (language.id === 'python' && !pyodide)}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
          </div>
        </div>

        {/* Editor & Output Split */}
        <div className="flex flex-col lg:flex-row gap-4 flex-grow min-h-0 overflow-hidden relative">
          
          {/* Backdrop for expanded panel */}
          {expandedPanel && (
            <div 
              className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm animate-in fade-in duration-200" 
              onClick={() => setExpandedPanel(null)}
            />
          )}

          {/* Editor Panel */}
          <div className={
            expandedPanel === 'editor'
              ? 'fixed inset-4 sm:inset-8 z-[70] flex flex-col border border-border rounded-lg bg-[#1e1e1e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'
              : 'relative flex flex-col border border-border rounded-md overflow-hidden bg-[#1e1e1e] lg:w-[50%] flex-grow'
          }>
             <div className="absolute top-2 right-4 z-10 transition-opacity duration-300">
                <button 
                    onClick={() => toggleExpand('editor')}
                    className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    title={expandedPanel === 'editor' ? "Collapse" : "Expand"}
                >
                    {expandedPanel === 'editor' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
             </div>
            <Editor
              height="100%"
              language={language.id === 'web' ? 'html' : language.id === 'cpp' ? 'cpp' : language.id === 'csharp' ? 'csharp' : language.id}
              theme={editorTheme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className={
            expandedPanel === 'output'
              ? 'fixed inset-4 sm:inset-8 z-[70] flex flex-col border border-border rounded-lg bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-card-foreground'
              : 'relative flex flex-col border border-border rounded-md overflow-hidden bg-card text-card-foreground lg:w-[50%] flex-grow'
          }>
             <div className="absolute top-2 right-4 z-10 transition-opacity duration-300">
                <button 
                    onClick={() => toggleExpand('output')}
                    className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    title={expandedPanel === 'output' ? "Collapse" : "Expand"}
                >
                    {expandedPanel === 'output' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
             </div>

            {/* Web Preview (Iframe) */}
            {language.id === 'web' && (
                <div className="flex-grow bg-white border-b border-slate-800 relative">
                    <div className="absolute top-0 left-0 px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider z-10">Preview</div>
                    {iframeSrc ? (
                        <iframe 
                            src={iframeSrc} 
                            className="w-full h-full border-none" 
                            title="Preview" 
                            sandbox="allow-scripts allow-modals"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                            Click Run to see preview
                        </div>
                    )}
                </div>
            )}

            {/* Console Output */}
            <div className={`${language.id === 'web' ? 'h-1/3 min-h-[150px]' : 'h-full'} flex flex-col`}>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border text-xs font-mono text-muted-foreground shrink-0">
                <Terminal size={14} />
                <span>Output Console</span>
                </div>
                <pre className="flex-grow p-4 font-mono text-sm overflow-auto whitespace-pre-wrap bg-card text-foreground">
                {output || <span className="text-muted-foreground italic">Run code to see output...</span>}
                </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
