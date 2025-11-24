import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import CryptoJS from 'crypto-js';
import { Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
  });
  const [copiedAlgo, setCopiedAlgo] = useState(null);

  const generateHashes = (text) => {
    setInput(text);
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }
    setHashes({
      md5: CryptoJS.MD5(text).toString(),
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: CryptoJS.SHA256(text).toString(),
      sha512: CryptoJS.SHA512(text).toString(),
    });
  };

  const copyToClipboard = (text, algo) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedAlgo(algo);
      setTimeout(() => setCopiedAlgo(null), 2000);
    }
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes."
    >
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Input Text</label>
          <Textarea
            className="h-32 resize-y"
            value={input}
            onChange={(e) => generateHashes(e.target.value)}
            placeholder="Type text to hash..."
          />
        </div>

        <div className="space-y-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="space-y-1.5">
              <label className="text-sm font-medium leading-none uppercase">{algo}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  value={hash}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(hash, algo)}
                  title="Copy"
                >
                  {copiedAlgo === algo ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
