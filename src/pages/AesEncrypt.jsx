import React, { useState, useEffect, useRef, useCallback } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Lock, Unlock, Copy, Trash2, Check, Shield, ShieldX, Settings2, Download, RefreshCw, AlertTriangle, UploadCloud, X, File as FileIcon, Info, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { QRCodeSVG } from 'qrcode.react'; 
import {
  deriveKey,
  generateSalt,
  generateIV,
  generateSecurePassword,
  encryptAES,
  decryptAES,
  textToBuffer,
  bufferToText,
  bufferToBase64,
  base64ToBuffer,
  bufferToHex,
  hexToBuffer
} from '../utils/aesCrypto';

export default function AesEncrypt() {
  const [inputType, setInputType] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('AES-GCM');
  const [iterations, setIterations] = useState(100000);
  
  const [outputFormat, setOutputFormat] = useState('json');
  const [output, setOutput] = useState('');
  const [outputFile, setOutputFile] = useState(null);
  
  const [error, setError] = useState('');
  const [integrityError, setIntegrityError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [details, setDetails] = useState(null);

  const timeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTextInput('');
      setPassword('');
      setFileInput(null);
      setOutput('');
      setOutputFile(null);
      setDetails(null);
      setError('Sensitive data automatically cleared due to 5 minutes of inactivity.');
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    resetTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [textInput, password, fileInput, output, mode, iterations, resetTimeout]);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-muted' };
    let score = 0;
    if (pwd.length > 8) score += 1;
    if (pwd.length > 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    if (score <= 2) return { score, label: 'Weak', color: 'bg-destructive' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };
  const pwdStrength = getPasswordStrength(password);

  const handleGenerateKey = () => {
    setPassword(generateSecurePassword(24));
  };

  const handleClear = () => {
    setTextInput('');
    setFileInput(null);
    setPassword('');
    setOutput('');
    setOutputFile(null);
    setError('');
    setDetails(null);
    setIntegrityError(false);
  };

  const handleEncrypt = async () => {
    setError(''); setIntegrityError(false); setOutput(''); setOutputFile(null); setDetails(null);
    try {
      if (!password) throw new Error('Password / Secret Key is required.');
      if (inputType === 'text' && !textInput) throw new Error('Input text is required.');
      if (inputType === 'file' && !fileInput) throw new Error('A file is required.');

      const salt = generateSalt(16);
      const iv = generateIV(mode);
      const key = await deriveKey(password, salt, iterations, mode);

      let plaintextBuffer;
      if (inputType === 'file') {
        plaintextBuffer = await fileInput.arrayBuffer();
      } else {
        plaintextBuffer = textToBuffer(textInput);
      }

      const encryptedBuffer = await encryptAES(mode, key, iv, plaintextBuffer);
      const rawKey = await crypto.subtle.exportKey('raw', key);

      setDetails({
        salt: bufferToHex(salt),
        iv: bufferToHex(iv),
        key: bufferToHex(rawKey).substring(0, 8) + '...',
        algorithm: mode,
        iterations
      });

      if (inputType === 'file') {
        const meta = JSON.stringify({ m: mode, i: iterations, s: bufferToBase64(salt), v: bufferToBase64(iv) });
        const metaBuffer = textToBuffer(meta);
        const metaLen = new Uint32Array([metaBuffer.byteLength]);
        const blob = new Blob([metaLen, metaBuffer, encryptedBuffer], { type: 'application/octet-stream' });
        
        const ext = fileInput.name.substring(fileInput.name.lastIndexOf('.'));
        const originalName = ext ? fileInput.name.replace(ext, '') : fileInput.name;
        const outName = originalName + '.encrypted';
        
        const fileObj = new File([blob], outName, { type: 'application/octet-stream' });
        setOutputFile(fileObj);
        setOutput(`Encrypted file ready: ${outName}`);
      } else {
        if (outputFormat === 'json') {
          const payload = {
            alg: mode,
            iterations: iterations,
            salt: bufferToBase64(salt),
            iv: bufferToBase64(iv),
            ciphertext: bufferToBase64(encryptedBuffer)
          };
          setOutput(JSON.stringify(payload, null, 2));
        } else {
          const concat = new Uint8Array(salt.byteLength + iv.byteLength + encryptedBuffer.byteLength);
          concat.set(new Uint8Array(salt), 0);
          concat.set(new Uint8Array(iv), salt.byteLength);
          concat.set(new Uint8Array(encryptedBuffer), salt.byteLength + iv.byteLength);
          
          if (outputFormat === 'base64') setOutput(bufferToBase64(concat.buffer));
          else setOutput(bufferToHex(concat.buffer));
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDecrypt = async () => {
    setError(''); setIntegrityError(false); setOutput(''); setOutputFile(null); setDetails(null);
    try {
      if (!password) throw new Error('Password / Secret Key is required.');
      if (inputType === 'text' && !textInput) throw new Error('Input text is required.');
      if (inputType === 'file' && !fileInput) throw new Error('A file is required.');

      let ciphertextBuffer, salt, iv, workMode, workIters;

      if (inputType === 'file') {
        const arrayBuffer = await fileInput.arrayBuffer();
        if (arrayBuffer.byteLength < 4) throw new Error('Invalid or corrupted file format.');
        const metaLen = new Uint32Array(arrayBuffer.slice(0, 4))[0];
        if (metaLen <= 0 || metaLen > arrayBuffer.byteLength - 4) throw new Error('Corrupted metadata in file.');
        const metaStr = bufferToText(arrayBuffer.slice(4, 4 + metaLen));
        const meta = JSON.parse(metaStr);
        if (!meta.s || !meta.v || !meta.m) throw new Error('Missing encryption metadata in file.');
        
        salt = base64ToBuffer(meta.s);
        iv = base64ToBuffer(meta.v);
        workMode = meta.m;
        workIters = meta.i || 100000;
        ciphertextBuffer = arrayBuffer.slice(4 + metaLen);
      } else {
        let isJson = false;
        try {
          const parsed = JSON.parse(textInput);
          if (parsed.alg && parsed.salt && parsed.iv && parsed.ciphertext) {
            isJson = true;
            workMode = parsed.alg;
            workIters = parsed.iterations || 100000;
            salt = base64ToBuffer(parsed.salt);
            iv = base64ToBuffer(parsed.iv);
            ciphertextBuffer = base64ToBuffer(parsed.ciphertext);
          }
        } catch (e) { /* fallback */ }

        if (!isJson) {
          workMode = mode;
          workIters = iterations;
          const ivLen = workMode === 'AES-GCM' ? 12 : 16;
          let rawBuffer;
          
          const cleanText = textInput.trim();
          const isHex = /^[0-9a-fA-F]+$/.test(cleanText) && cleanText.length % 2 === 0;
          
          if (isHex) {
            try { rawBuffer = hexToBuffer(cleanText); } catch(e) {}
          }
          if (!rawBuffer) {
            try { rawBuffer = base64ToBuffer(cleanText); } catch(e) {}
          }
          if (!rawBuffer) throw new Error('Unrecognized format. Expected JSON, Base64, or Hex string.');
          
          if (rawBuffer.byteLength < 16 + ivLen) throw new Error('Ciphertext too short. Invalid data or mismatching format.');
          salt = rawBuffer.slice(0, 16);
          iv = rawBuffer.slice(16, 16 + ivLen);
          ciphertextBuffer = rawBuffer.slice(16 + ivLen);
        }
      }

      setMode(workMode);
      setIterations(workIters);

      const key = await deriveKey(password, salt, workIters, workMode);
      let decryptedBuffer;
      try {
        decryptedBuffer = await decryptAES(workMode, key, iv, ciphertextBuffer);
      } catch (err) {
        if (workMode === 'AES-GCM') setIntegrityError(true);
        throw new Error('Decryption failed. Incorrect password, wrong configurations, or tampered data.');
      }

      const rawKey = await crypto.subtle.exportKey('raw', key);
      setDetails({
        salt: bufferToHex(salt),
        iv: bufferToHex(iv),
        key: bufferToHex(rawKey).substring(0, 8) + '...',
        algorithm: workMode,
        iterations: workIters
      });

      if (inputType === 'file') {
        const blob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
        const outName = fileInput.name.replace('.encrypted', '.decrypted');
        const fileObj = new File([blob], outName, { type: 'application/octet-stream' });
        setOutputFile(fileObj);
        setOutput(`Decrypted file ready: ${outName}`);
      } else {
        setOutput(bufferToText(decryptedBuffer));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = () => {
    if (output && !outputFile) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (outputFile) {
      const url = URL.createObjectURL(outputFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputFile.name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (output) {
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputFormat === 'json' ? 'encrypted_data.json' : 'output.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileInput(e.dataTransfer.files[0]);
    }
  };

  const renderInputTab = () => (
    <div className="flex bg-muted/50 p-1 rounded-lg w-fit border mb-4">
      <button 
        onClick={() => setInputType('text')} 
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${inputType === 'text' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Text String
      </button>
      <button 
        onClick={() => setInputType('file')} 
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${inputType === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        File Upload
      </button>
    </div>
  );

  return (
    <ToolLayout
      title="Advanced AES Encryption"
      description="Production-grade local Web Crypto API encryption utility supporting AES-GCM, PBKDF2, and robust file handling."
    >
      <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 py-3 rounded-lg text-sm flex items-center mb-6 shadow-sm font-medium">
        <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
        <div>
          <strong>Secure Local Environment:</strong> All cryptographic operations happen securely within your browser. No keys or data ever leave your device. Auto-cleans after 5m of inactivity.
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Data Input */}
        <div className="space-y-6">
          
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            {renderInputTab()}
            
            {inputType === 'text' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Payload</label>
                <Textarea
                  className="h-36 resize-y font-mono text-sm leading-relaxed"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste JSON structure to decrypt, plain text to encrypt, or raw string..."
                />
              </div>
            ) : (
              <div 
                className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFileInput(e.target.files[0])} />
                {fileInput ? (
                  <div className="flex flex-col items-center text-center px-4">
                    <FileIcon className="w-8 h-8 text-primary mb-2" />
                    <span className="font-medium text-foreground max-w-full truncate px-4">{fileInput.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">{(fileInput.size / 1024).toFixed(2)} KB</span>
                    <Button variant="ghost" size="sm" className="mt-2 h-7" onClick={(e) => { e.stopPropagation(); setFileInput(null); }}>
                      <X className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="font-medium text-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground mt-1">Any file fully processed locally</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Secret Key / Password</label>
                <Button variant="ghost" size="sm" onClick={handleGenerateKey} className="h-6 text-xs px-2 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="w-3 h-3 mr-1.5" /> Auto-gen Secure Key
                </Button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="font-mono pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong passphrase"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${pwdStrength.color}`} style={{ width: `${(pwdStrength.score / 5) * 100}%`, minWidth: password ? '10%' : '0%' }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground w-12 text-right">{pwdStrength.label}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <button onClick={() => setShowSettings(!showSettings)} className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
                <Settings2 className="w-4 h-4 mr-2" /> Advanced Cryptography Settings {showSettings ? '(Hide)' : '(Show)'}
              </button>
              
              {showSettings && (
                <div className="mt-4 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 p-3 bg-muted/30 rounded-lg border">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Mode</label>
                    <select 
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                    >
                      <option value="AES-GCM">AES-GCM (Authenticated, Recommended)</option>
                      <option value="AES-CBC">AES-CBC (Classic)</option>
                      <option value="AES-CTR">AES-CTR (Stream)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">PBKDF2 Iterations</label>
                    <input 
                      type="number"
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={iterations}
                      onChange={(e) => setIterations(Number(e.target.value))}
                      min="1000"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Output Format (Text Only)</label>
                    <select 
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      title="Files always use an optimized binary format"
                    >
                      <option value="json">JSON Structure (Contains IV/Salt, Recommended)</option>
                      <option value="base64">Raw Base64 (Packed Salt+IV+Cipher)</option>
                      <option value="hex">Raw Hex (Packed Salt+IV+Cipher)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleEncrypt} className="flex-1 font-medium shadow-sm"><Lock className="mr-2 w-4 h-4" /> Encrypt</Button>
            <Button onClick={handleDecrypt} variant="outline" className="flex-1 font-medium border-primary/20 hover:bg-primary/5 text-primary"><Unlock className="mr-2 w-4 h-4" /> Decrypt</Button>
            <Button variant="outline" className="px-3" onClick={handleClear} title="Clear all data"><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium flex items-start animate-in fade-in zoom-in-95">
              <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {integrityError && (
             <div className="p-3 bg-red-600/10 text-red-600 border border-red-600/30 rounded-lg text-sm font-medium flex items-start animate-in fade-in zoom-in-95">
              <ShieldX className="w-5 h-5 mr-2 shrink-0" />
              <span><strong>Integrity Check Failed:</strong> The data has been tampered with or corrupted. Decryption aborted securely.</span>
            </div>
          )}
        </div>

        {/* Right Column: Output & Details */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm flex flex-col h-[calc(100%-1.5rem)] min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold flex items-center">
                Processed Output
                {outputFile && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] uppercase">File Ready</span>}
                {!outputFile && output && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] uppercase">Text Ready</span>}
              </label>
              <div className="flex gap-2">
                {!outputFile && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2" disabled={!output}>
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-2 text-primary" disabled={!output && !outputFile} title="Download File">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {outputFile ? (
              <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed rounded-lg bg-muted/10 p-6 text-center">
                <FileIcon className="w-16 h-16 text-primary/50 mb-4" />
                <h4 className="font-medium">{outputFile.name}</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-xs">
                  Your file has been securely processed and packed with necessary metadata.
                </p>
                <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2"/> Download File</Button>
              </div>
            ) : (
              <Textarea
                readOnly
                className="flex-1 resize-none font-mono text-sm bg-muted/30 whitespace-pre opacity-90 p-4 leading-relaxed"
                value={output}
                placeholder="Encrypted or decrypted output will appear here..."
              />
            )}

            {details && (
              <div className="mt-5 border-t pt-4">
                <button 
                  onClick={() => setShowDetails(!showDetails)} 
                  className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full"
                >
                  <Info className="w-4 h-4 mr-2" /> Technical Verification Details {showDetails ? '(Hide)' : '(Expand)'}
                </button>
                
                {showDetails && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-muted/40 p-4 rounded-lg border text-xs font-mono break-all animate-in slide-in-from-top-2">
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase block mb-1">Algorithm</span>
                      <span className="text-foreground">{details.algorithm}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase block mb-1">Iterations</span>
                      <span className="text-foreground">{details.iterations.toLocaleString()} (PBKDF2)</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase block mb-1">Salt (128-bit)</span>
                      <span className="text-foreground">{details.salt}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase block mb-1">Derived Key Mask</span>
                      <span className="text-foreground">{details.key}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-semibold text-muted-foreground uppercase block mb-1">Initialization Vector (Nonce)</span>
                      <span className="text-foreground">{details.iv}</span>
                    </div>
                    
                    {!outputFile && output && output.length < 500 && (
                      <div className="md:col-span-2 mt-4 flex flex-col items-center">
                         <span className="font-semibold text-muted-foreground uppercase mb-2">Payload QR Code</span>
                         <div className="bg-white p-2 rounded-md">
                           <QRCodeSVG value={output} size={130} />
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
