import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

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
        <div className="relative group">
          <Input
            type="text"
            readOnly
            value={password}
            className="h-20 text-2xl md:text-3xl font-mono text-center pr-14"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={copyToClipboard}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted"
            title="Copy"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none">Password Length</label>
                <span className="font-mono bg-muted px-2 py-1 rounded text-sm font-bold">{length}</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(options).map((key) => (
                <label key={key} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded focus:ring-primary"
                  />
                  <span className="capitalize text-sm font-medium">{key}</span>
                </label>
              ))}
            </div>

            <Button
              onClick={generatePassword}
              className="w-full h-12 text-lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Generate New Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
