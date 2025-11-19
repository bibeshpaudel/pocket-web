import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Trash2, Check } from 'lucide-react';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertCase = (type) => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase());
        break;
      case 'lower':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))));
        break;
      case 'sentence':
        setText(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
        break;
      case 'camel':
        setText(text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, ''));
        break;
      case 'snake':
        setText(text && text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          .map(x => x.toLowerCase())
          .join('_'));
        break;
      case 'kebab':
        setText(text && text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          .map(x => x.toLowerCase())
          .join('-'));
        break;
      default:
        break;
    }
  };

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between different cases (upper, lower, camel, snake, etc.)."
    >
      <div className="grid gap-6">
        <div>
          <label className="block font-bold mb-2 text-textSecondary">Text Input</label>
          <textarea
            className="w-full h-48 p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-y text-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here..."
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'upper', label: 'UPPERCASE' },
            { id: 'lower', label: 'lowercase' },
            { id: 'title', label: 'Title Case' },
            { id: 'sentence', label: 'Sentence case' },
            { id: 'camel', label: 'camelCase' },
            { id: 'snake', label: 'snake_case' },
            { id: 'kebab', label: 'kebab-case' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => convertCase(btn.id)}
              className="bg-slate-800 hover:bg-accent text-text hover:text-white px-4 py-2 border border-white/10 rounded-base transition-colors font-bold text-sm"
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={copyToClipboard}
            className="bg-accent hover:bg-accentHover text-white px-6 py-2 rounded-base transition-colors font-bold flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={() => setText('')}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-6 py-2 border border-red-500/50 rounded-base transition-colors font-bold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
