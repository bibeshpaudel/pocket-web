import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ReactMarkdown from 'react-markdown';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing markdown...');

  return (
    <ToolLayout
      title="Markdown Previewer"
      description="Write and preview Markdown in real-time."
    >
      <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
        <div className="flex flex-col">
          <label className="block font-bold mb-2 text-textSecondary">Markdown Input</label>
          <textarea
            className="flex-grow w-full p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-none text-text"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="block font-bold mb-2 text-textSecondary">Preview</label>
          <div className="flex-grow w-full p-4 bg-slate-900/50 border border-white/10 rounded-base overflow-auto prose prose-invert max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
