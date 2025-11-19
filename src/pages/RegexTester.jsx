import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';

export default function RegexTester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (!regex) {
        setMatches([]);
        setError('');
        return;
      }
      const re = new RegExp(regex, flags);
      const found = [];
      let match;
      
      // Reset lastIndex for global matches
      if (flags.includes('g')) {
        while ((match = re.exec(text)) !== null) {
          found.push({
            index: match.index,
            match: match[0],
            groups: match.groups
          });
          if (match.index === re.lastIndex) {
            re.lastIndex++;
          }
        }
      } else {
        match = re.exec(text);
        if (match) {
          found.push({
            index: match.index,
            match: match[0],
            groups: match.groups
          });
        }
      }
      
      setMatches(found);
      setError('');
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  }, [regex, flags, text]);

  return (
    <ToolLayout
      title="RegEx Tester"
      description="Test and debug regular expressions."
    >
      <div className="grid gap-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-4">
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Regular Expression</label>
            <input
              type="text"
              className="w-full font-mono"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="e.g. [a-z]+"
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Flags</label>
            <input
              type="text"
              className="w-24 font-mono"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="gmi"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 text-red-200 border border-red-500/50 rounded-base text-sm font-bold">
            Error: {error}
          </div>
        )}

        <div>
          <label className="block font-bold mb-2 text-textSecondary">Test String</label>
          <textarea
            className="w-full h-32 p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-y text-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text to test against..."
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-textSecondary">Matches ({matches.length})</label>
          <div className="h-48 overflow-auto p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm text-text">
            {matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((m, i) => (
                  <li key={i} className="p-2 bg-slate-800/50 rounded border border-white/5">
                    <span className="font-bold text-accent">Match {i + 1}:</span> "{m.match}" <span className="opacity-50 text-xs text-textSecondary">(Index: {m.index})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="opacity-50 italic text-textSecondary">No matches found</p>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
