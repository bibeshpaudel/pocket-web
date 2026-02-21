import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';
import ExpandableOutput from '../components/ExpandableOutput';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing markdown...');

  return (
    <ToolLayout
      title="Markdown Previewer"
      description="Write and preview Markdown in real-time."
    >
      <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium leading-none">Markdown Input</label>
          <Textarea
            className="flex-grow resize-none font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium leading-none">Preview</label>
          <ExpandableOutput title="Markdown Preview">
            <Card className="flex-grow overflow-hidden h-full">
              <CardContent className="h-full overflow-auto p-6 prose prose-invert max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </CardContent>
            </Card>
          </ExpandableOutput>
        </div>
      </div>
    </ToolLayout>
  );
}
