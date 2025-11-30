import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { jwtDecode } from 'jwt-decode';
import * as jose from 'jose';
import { Check, X, Shield, Key, AlertCircle } from 'lucide-react';

export default function JwtDebugger() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [secret, setSecret] = useState('');
  const [isVerified, setIsVerified] = useState(null); // null, true, false
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setHeader(null);
      setPayload(null);
      setIsVerified(null);
      setError('');
      return;
    }

    try {
      const decodedHeader = jwtDecode(token, { header: true });
      const decodedPayload = jwtDecode(token);
      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError('');
      
      // Reset verification when token changes
      setIsVerified(null);
    } catch (err) {
      setError('Invalid JWT format');
      setHeader(null);
      setPayload(null);
    }
  }, [token]);

  const verifySignature = async () => {
    if (!token || !secret) return;

    try {
      const encoder = new TextEncoder();
      // Try HS256 (Symmetric) first as it's most common for simple secrets
      // For RS256, user would need to paste public key, which jose handles if formatted correctly
      
      // Simple heuristic: if secret looks like a PEM, try importSPKI, else assume secret key bytes
      let key;
      if (secret.includes('BEGIN PUBLIC KEY')) {
         key = await jose.importSPKI(secret, header.alg);
      } else if (secret.includes('BEGIN CERTIFICATE')) {
         key = await jose.importX509(secret, header.alg);
      } else {
         key = encoder.encode(secret);
      }

      await jose.jwtVerify(token, key);
      setIsVerified(true);
    } catch (err) {
      console.error(err);
      setIsVerified(false);
    }
  };

  return (
    <ToolLayout
      title="JWT Debugger"
      description="Decode, verify, and generate JWTs."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Encoded Token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT here..."
              className="w-full h-48 p-4 bg-card border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary resize-none text-pink-500"
              spellCheck="false"
            />
          </div>

          <div className="space-y-4 p-6 bg-card border border-border rounded-lg">
             <div className="flex items-center gap-2 text-lg font-semibold">
                <Shield size={20} className="text-primary" />
                <h3>Signature Verification</h3>
             </div>
             
             <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                    Secret / Public Key
                </label>
                <textarea
                    value={secret}
                    onChange={(e) => { setSecret(e.target.value); setIsVerified(null); }}
                    placeholder="Enter your 256-bit secret or public key..."
                    className="w-full h-32 p-3 bg-muted/50 border border-border rounded-md font-mono text-sm focus:outline-none focus:border-primary resize-none"
                    spellCheck="false"
                />
             </div>

             <button
                onClick={verifySignature}
                disabled={!token || !secret || !!error}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
             >
                Verify Signature
             </button>

             {isVerified === true && (
                <div className="p-3 bg-green-500/10 text-green-500 rounded-md flex items-center gap-2 font-medium">
                    <Check size={18} />
                    Signature Verified
                </div>
             )}
             
             {isVerified === false && (
                <div className="p-3 bg-red-500/10 text-red-500 rounded-md flex items-center gap-2 font-medium">
                    <X size={18} />
                    Invalid Signature
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Decoded */}
        <div className="space-y-6">
            {error ? (
                <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
                    <div className="text-center">
                        <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
                        <p>{error}</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Header</label>
                        <div className="p-4 bg-card border border-border rounded-lg font-mono text-sm text-red-400 overflow-auto max-h-[200px]">
                            <pre>{header ? JSON.stringify(header, null, 2) : '// Header'}</pre>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Payload</label>
                        <div className="p-4 bg-card border border-border rounded-lg font-mono text-sm text-purple-400 overflow-auto max-h-[400px]">
                            <pre>{payload ? JSON.stringify(payload, null, 2) : '// Payload'}</pre>
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>
    </ToolLayout>
  );
}
