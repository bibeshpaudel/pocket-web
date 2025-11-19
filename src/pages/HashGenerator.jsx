import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import CryptoJS from 'crypto-js';
import { Copy, Check } from 'lucide-react';

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
        <div>
          <label className="block font-bold mb-2">Input Text</label>
          <textarea
            className="w-full h-32 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none focus:shadow-light dark:focus:shadow-dark transition-shadow resize-y"
            value={input}
            onChange={(e) => generateHashes(e.target.value)}
            placeholder="Type text to hash..."
          />
        </div>

        <div className="space-y-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo}>
              <label className="block font-bold mb-1 uppercase">{algo}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={hash}
                  className="flex-grow p-3 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(hash, algo)}
                  className="p-3 bg-main text-text border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all"
                  title="Copy"
                >
                  {copiedAlgo === algo ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
