import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { diffChars, diffWords, diffLines } from 'diff';

export default function TextCompare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [mode, setMode] = useState('chars');

  const compareText = () => {
    let diff;
    if (mode === 'chars') diff = diffChars(text1, text2);
    if (mode === 'words') diff = diffWords(text1, text2);
    if (mode === 'lines') diff = diffLines(text1, text2);
    setDiffResult(diff);
  };

  return (
    <ToolLayout
      title="Text Comparison"
      description="Compare two blocks of text and highlight differences."
    >
      <div className="grid gap-6">
        <div className="flex justify-center mb-4">
          <div className="flex gap-2 p-1 bg-slate-900/50 border border-white/10 rounded-base">
            {['chars', 'words', 'lines'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-sm font-bold capitalize transition-colors ${
                  mode === m ? 'bg-accent text-white' : 'hover:bg-white/5 text-textSecondary hover:text-text'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Original Text</label>
            <textarea
              className="w-full h-48 font-mono text-sm resize-none"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original text..."
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Changed Text</label>
            <textarea
              className="w-full h-48 font-mono text-sm resize-none"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste changed text..."
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={compareText}
            className="bg-accent hover:bg-accentHover text-white px-8 py-3 rounded-base transition-colors font-bold"
          >
            Compare Text
          </button>
        </div>

        {diffResult.length > 0 && (
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Comparison Result</label>
            <div className="p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm whitespace-pre-wrap break-words text-text">
              {diffResult.map((part, index) => {
                const color = part.added ? 'bg-green-500/20 text-green-200' : part.removed ? 'bg-red-500/20 text-red-200' : 'bg-transparent';
                return (
                  <span key={index} className={color}>
                    {part.value}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
