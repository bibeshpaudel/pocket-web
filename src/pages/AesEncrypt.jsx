import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, Copy, Trash2, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

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
          <Button onClick={toggleMode} variant="outline">
            {mode === 'encrypt' ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
            Switch to {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{mode === 'encrypt' ? 'Text' : 'Encrypted'} Input</label>
          <Textarea
            className="h-32 resize-y font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Type text to encrypt...' : 'Paste encrypted text...'}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Password / Secret Key</label>
          <Input
            type="password"
            className="font-mono"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleProcess}>
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => { setInput(''); setOutput(''); setPassword(''); setError(''); }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium leading-none">{mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Output</label>
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
