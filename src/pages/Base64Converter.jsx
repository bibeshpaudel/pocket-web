import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { ArrowDownUp, Copy, Trash2, Check, FileBracesCorner, File } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      if (!input) {
        setOutput('');
        return;
      }
      setOutput(btoa(input));
    } catch (err) {
      setOutput('Error: Invalid input for encoding');
    }
  };

  const handleDecode = () => {
    try {
      if (!input) {
        setOutput('');
        return;
      }
      setOutput(atob(input));
    } catch (err) {
      setOutput('Error: Invalid input for decoding');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="Base64 Converter"
      description="Encode and decode Base64 strings."
    >
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Input</label>
          <Textarea
            className="h-32 resize-y font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type text to encode or paste Base64 to decode..."
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleEncode}>
            <FileBracesCorner className="mr-2 h-4 w-4" />Encode
          </Button>
          <Button onClick={handleDecode}>
            <File  className="mr-2 h-4 w-4"/>Decode
          </Button>
          <Button
            variant="destructive"
            onClick={() => { setInput(''); setOutput(''); }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

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
            className="h-32 resize-y font-mono text-sm"
            value={output}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
