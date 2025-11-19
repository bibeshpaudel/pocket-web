import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, Copy, Trash2, Check } from 'lucide-react';

export default function AesEncrypt() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encrypt'); // encrypt | decrypt
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    try {
      if (!input || !password) {
        setError('Please provide both input text and a password.');
        setOutput('');
        return;
      }

      let result = '';
      if (mode === 'encrypt') {
        result = CryptoJS.AES.encrypt(input, password).toString();
      } else {
        const bytes = CryptoJS.AES.decrypt(input, password);
        result = bytes.toString(CryptoJS.enc.Utf8);
        if (!result) throw new Error('Invalid password or corrupted data');
      }

      setOutput(result);
      setError('');
    } catch (err) {
      setError('Error: ' + err.message);
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    setInput(output);
    setOutput(input);
    setError('');
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
      title="AES Encrypt/Decrypt"
      description="Securely encrypt and decrypt text using AES encryption."
    >
      <div className="grid gap-6">
        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 bg-main text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
          >
            {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            Switch to {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
          </button>
        </div>

        <div>
          <label className="block font-bold mb-2">{mode === 'encrypt' ? 'Text' : 'Encrypted'} Input</label>
          <textarea
            className="w-full h-32 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none focus:shadow-light dark:focus:shadow-dark transition-shadow resize-y"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Type text to encrypt...' : 'Paste encrypted text...'}
          />
        </div>

        <div>
          <label className="block font-bold mb-2">Password / Secret Key</label>
          <input
            type="password"
            className="w-full p-3 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono focus:outline-none focus:shadow-light dark:focus:shadow-dark transition-shadow"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleProcess}
            className="bg-main text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
          >
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setPassword(''); setError(''); }}
            className="bg-red-400 text-text px-6 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-200 text-red-800 border-2 border-red-800 rounded-base font-bold">
            {error}
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-bold">{mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Output</label>
            <button
              onClick={copyToClipboard}
              className="text-sm flex items-center gap-1 hover:underline"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            className="w-full h-32 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base font-mono text-sm focus:outline-none resize-y"
            value={output}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
