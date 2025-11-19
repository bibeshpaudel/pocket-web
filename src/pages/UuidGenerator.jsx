import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from 'uuid';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState('v4');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  const generateUuids = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      if (version === 'v4') newUuids.push(uuidv4());
      else if (version === 'v1') newUuids.push(uuidv1());
      else if (version === 'v7') newUuids.push(uuidv7());
    }
    setUuids(newUuids);
    setAllCopied(false);
    setCopiedIndex(null);
  };

  // Initial generation
  useEffect(() => {
    generateUuids();
  }, []);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUIDs (v1, v4, and v7)."
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-grow md:flex-grow-0 w-full md:w-48">
            <label className="block font-bold mb-2 text-textSecondary">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full font-bold"
            />
          </div>
          <div className="flex-grow md:flex-grow-0 w-full md:w-48">
            <label className="block font-bold mb-2 text-textSecondary">Version</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full font-bold"
            >
              <option value="v4">Version 4 (Random)</option>
              <option value="v1">Version 1 (Timestamp)</option>
              <option value="v7">Version 7 (Time-ordered)</option>
            </select>
          </div>
          <button
            onClick={generateUuids}
            className="bg-accent hover:bg-accentHover text-white px-6 py-2 rounded-base transition-colors font-bold flex items-center gap-2 h-[42px]"
          >
            <RefreshCw className="w-5 h-5" /> Generate
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-bold text-textSecondary">Generated UUIDs</label>
            <button
              onClick={copyAll}
              className="text-sm flex items-center gap-1 hover:text-accent transition-colors"
            >
              {allCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {allCopied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          {uuids.map((uuid, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={uuid}
                className="flex-grow font-mono text-sm bg-slate-900/50 border border-white/10 rounded-base px-4 py-3 text-text focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(uuid, index)}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-base transition-colors text-text min-w-[42px] flex justify-center"
                title="Copy"
              >
                {copiedIndex === index ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
