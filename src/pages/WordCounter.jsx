import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

    setStats({ words, characters, sentences, paragraphs });
  }, [text]);

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in real-time."
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-accent/20 border border-accent/50 rounded-base text-center">
            <div className="text-3xl font-heading text-text">{stats.words}</div>
            <div className="text-sm font-bold text-textSecondary">Words</div>
          </div>
          <div className="p-4 bg-slate-900/50 border border-white/10 rounded-base text-center">
            <div className="text-3xl font-heading text-text">{stats.characters}</div>
            <div className="text-sm font-bold text-textSecondary">Characters</div>
          </div>
          <div className="p-4 bg-slate-900/50 border border-white/10 rounded-base text-center">
            <div className="text-3xl font-heading text-text">{stats.sentences}</div>
            <div className="text-sm font-bold text-textSecondary">Sentences</div>
          </div>
          <div className="p-4 bg-slate-900/50 border border-white/10 rounded-base text-center">
            <div className="text-3xl font-heading text-text">{stats.paragraphs}</div>
            <div className="text-sm font-bold text-textSecondary">Paragraphs</div>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-textSecondary">Text Input</label>
          <textarea
            className="w-full h-64 p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-y text-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste text here..."
          />
        </div>
      </div>
    </ToolLayout>
  );
}
