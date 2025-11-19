import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Trash2, Check } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format and validate JSON data with proper indentation."
    >
      <div className="grid gap-6">
        <div>
          <label className="block font-bold mb-2">Input JSON</label>
          <textarea
            className="w-full h-48 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none focus:shadow-light dark:focus:shadow-dark transition-shadow resize-y"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={formatJson}
            className="bg-main text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
          >
            Format JSON
          </button>
          <button
            onClick={clearAll}
            className="bg-red-400 text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-200 text-red-800 border-2 border-red-800 rounded-base">
            {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-bold">Formatted Output</label>
              <button
                onClick={copyToClipboard}
                className="text-sm flex items-center gap-1 hover:underline"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-96 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none resize-y"
              value={output}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
