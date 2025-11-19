import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let chars = '';
    if (options.uppercase) chars += charset.uppercase;
    if (options.lowercase) chars += charset.lowercase;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;

    if (chars === '') {
      setPassword('');
      return;
    }

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure passwords locally."
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="relative">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full p-6 text-2xl md:text-3xl font-mono text-center bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-main/20 rounded-base transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold">Password Length</label>
              <span className="font-mono bg-main px-2 rounded-base border-2 border-border dark:border-darkBorder text-sm font-bold">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-main h-2 bg-bg dark:bg-darkBg rounded-lg appearance-none cursor-pointer border-2 border-border dark:border-darkBorder"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(options).map((key) => (
              <label key={key} className="flex items-center gap-3 p-4 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base cursor-pointer hover:bg-main/10 transition-colors">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="w-5 h-5 accent-main border-2 border-border rounded focus:ring-0"
                />
                <span className="capitalize font-bold">{key}</span>
              </label>
            ))}
          </div>

          <button
            onClick={generatePassword}
            className="w-full flex items-center justify-center gap-2 bg-main text-text p-4 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold text-lg"
          >
            <RefreshCw className="w-6 h-6" /> Generate New Password
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
