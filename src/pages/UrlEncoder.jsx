import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { ArrowDownUp, Copy, Trash2, Check } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // encode | decode
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    try {
      if (!input) {
        setOutput('');
        return;
      }
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (err) {
      setOutput('Error: Invalid input for decoding');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode and decode URLs."
    >
      <div className="grid gap-6">
        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 bg-main text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
          >
            <ArrowDownUp className="w-4 h-4" />
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </button>
        </div>

        <div>
          <label className="block font-bold mb-2">{mode === 'encode' ? 'Text' : 'Encoded'} Input</label>
          <textarea
            className="w-full h-32 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none focus:shadow-light dark:focus:shadow-dark transition-shadow resize-y"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste URL to decode...'}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleConvert}
            className="bg-main text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); }}
            className="bg-red-400 text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-bold">{mode === 'encode' ? 'Encoded' : 'Decoded'} Output</label>
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
            className="w-full h-32 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none resize-y"
            value={output}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
