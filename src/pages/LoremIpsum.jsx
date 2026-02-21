import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    
    let result = [];
    for (let i = 0; i < paragraphs; i++) {
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
        <Card>
          <CardContent className="flex items-end gap-4 pt-6">
            <div className="flex-grow space-y-2">
              <label className="text-sm font-medium leading-none">Paragraphs</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={paragraphs}
                onChange={(e) => setParagraphs(Number(e.target.value))}
              />
            </div>
            <Button onClick={generateLorem}>
              <RefreshCw className="mr-2 h-4 w-4" /> Generate
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium leading-none">Output</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8"
            >
              {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Textarea
            readOnly
            value={text}
            className="h-96 p-6 font-serif text-lg leading-relaxed resize-y"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
