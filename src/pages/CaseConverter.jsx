import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Trash2, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

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
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Text Input</label>
          <Textarea
            className="h-48 resize-y"
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
            <Button
              key={btn.id}
              variant="outline"
              onClick={() => convertCase(btn.id)}
              className="font-bold"
            >
              {btn.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={copyToClipboard}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setText('')}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
