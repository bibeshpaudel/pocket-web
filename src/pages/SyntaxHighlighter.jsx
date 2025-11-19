import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import dracula from 'react-syntax-highlighter/dist/esm/styles/hljs/dracula';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('java', java);

export default function SyntaxHighlighterTool() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  return (
    <ToolLayout
      title="Syntax Highlighter"
      description="Highlight code syntax for various languages."
    >
      <div className="grid gap-6">
        <div className="flex gap-4 flex-wrap">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="font-bold"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="css">CSS</option>
            <option value="xml">HTML/XML</option>
            <option value="csharp">C#</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Code Input</label>
            <textarea
              className="w-full h-96 font-mono text-sm resize-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Highlighted Output</label>
            <div className="h-96 overflow-auto border border-white/10 rounded-base bg-slate-900/50">
              <SyntaxHighlighter
                language={language}
                style={dracula}
                customStyle={{ margin: 0, height: '100%', background: 'transparent' }}
                showLineNumbers={true}
              >
                {code || '// Code preview will appear here'}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
