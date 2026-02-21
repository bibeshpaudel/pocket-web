import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Trash2, Download, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ExpandableOutput from '../components/ExpandableOutput';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Listen for theme changes
  useState(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format and validate JSON data with proper indentation."
    >
      <div className="grid gap-6 lg:grid-cols-2 h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Input JSON</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAll} className="h-8">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Clear
              </Button>
              <Button size="sm" onClick={formatJson} className="h-8">
                Format
              </Button>
            </div>
          </div>
          <Textarea
            className="h-[500px] font-mono text-sm resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none">Formatted Output</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadJson} disabled={!output} className="h-8">
                <Download className="mr-2 h-3.5 w-3.5" /> Download
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output} className="h-8">
                {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-md border border-input bg-muted/50 overflow-hidden">
            {error ? (
              <div className="p-4 text-sm text-destructive bg-destructive/10 h-full">
                {error}
              </div>
            ) : output ? (
              <ExpandableOutput value={output} title="Formatted JSON Output">
                <SyntaxHighlighter
                  language="json"
                  style={theme === 'dark' ? vscDarkPlus : vs}
                  customStyle={{ margin: 0, height: '100%', borderRadius: 0, fontSize: '14px', backgroundColor: 'transparent' }}
                  showLineNumbers={true}
                >
                  {output}
                </SyntaxHighlighter>
              </ExpandableOutput>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Formatted JSON will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
