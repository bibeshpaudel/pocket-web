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
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';

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
            className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium"
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
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Code Input</label>
            <Textarea
              className="h-96 resize-none font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Highlighted Output</label>
            <Card className="h-96 overflow-hidden bg-[#282a36]">
              <CardContent className="h-full p-0 overflow-auto">
                <SyntaxHighlighter
                  language={language}
                  style={dracula}
                  customStyle={{ margin: 0, minHeight: '100%', padding: '1.5rem', background: 'transparent' }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {code || '// Code preview will appear here'}
                </SyntaxHighlighter>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
