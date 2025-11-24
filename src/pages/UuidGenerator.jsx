import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState('v4');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  const generateUuids = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      if (version === 'v4') newUuids.push(uuidv4());
      else if (version === 'v1') newUuids.push(uuidv1());
      else if (version === 'v7') newUuids.push(uuidv7());
    }
    setUuids(newUuids);
    setAllCopied(false);
    setCopiedIndex(null);
  };

  // Initial generation
  useEffect(() => {
    generateUuids();
  }, []);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUIDs (v1, v4, and v7)."
    >
      <div className="grid gap-6">
        <Card>
          <CardContent className="flex flex-wrap items-end gap-4 pt-6">
            <div className="flex-grow md:flex-grow-0 w-full md:w-48 space-y-2">
              <label className="text-sm font-medium leading-none">Count</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            <div className="flex-grow md:flex-grow-0 w-full md:w-48 space-y-2">
              <label className="text-sm font-medium leading-none">Version</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Timestamp)</option>
                <option value="v7">Version 7 (Time-ordered)</option>
              </select>
            </div>
            <Button onClick={generateUuids} className="w-full md:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium leading-none text-muted-foreground">Generated UUIDs</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAll}
              className="h-8"
            >
              {allCopied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
              {allCopied ? 'Copied!' : 'Copy All'}
            </Button>
          </div>
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  value={uuid}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(uuid, index)}
                  title="Copy"
                >
                  {copiedIndex === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
