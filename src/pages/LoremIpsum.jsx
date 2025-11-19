import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    
    let result = [];
    for (let i = 0; i < paragraphs; i++) {
      // Shuffle words slightly to make paragraphs look different
      const words = lorem.split(' ');
      const shuffled = words.sort(() => 0.5 - Math.random()).join(' ');
      // Ensure it starts with Lorem ipsum for the first paragraph if desired, but random is fine for variation
      // Let's just repeat the standard text for now but maybe slice it differently
      result.push(lorem);
    }
    setText(result.join('\n\n'));
  };

  // Initial generation
  useEffect(() => {
    generateLorem();
  }, []);

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs."
    >
      <div className="grid gap-6">
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <label className="block font-bold mb-2 text-textSecondary">Paragraphs</label>
            <input
              type="number"
              min="1"
              max="20"
              value={paragraphs}
              onChange={(e) => setParagraphs(Number(e.target.value))}
              className="w-full font-bold"
            />
          </div>
          <button
            onClick={generateLorem}
            className="bg-accent hover:bg-accentHover text-white px-6 py-2 rounded-base transition-colors font-bold flex items-center gap-2 h-[42px]"
          >
            <RefreshCw className="w-5 h-5" /> Generate
          </button>
        </div>

        <div className="relative group">
          <textarea
            readOnly
            value={text}
            className="w-full h-96 p-6 bg-slate-900/50 border border-white/10 rounded-base font-serif text-lg leading-relaxed focus:outline-none resize-y text-text"
          />
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-accent text-white border border-white/10 rounded-base transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
            title="Copy"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied && <span className="text-xs font-bold">Copied!</span>}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
