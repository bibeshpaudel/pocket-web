// Buffer conversions
export const textToBuffer = (text) => new TextEncoder().encode(text);
export const bufferToText = (buffer) => new TextDecoder().decode(buffer);

export const bufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToBuffer = (base64) => {
  try {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    throw new Error('Invalid Base64 string');
  }
};

export const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const hexToBuffer = (hex) => {
  if (typeof hex !== 'string' || hex.length % 2 !== 0) {
    throw new Error('Invalid Hex string');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
};

// Cryptography

export const generateSalt = (size = 16) => crypto.getRandomValues(new Uint8Array(size));

export const generateIV = (mode) => {
  if (mode === 'AES-GCM') return crypto.getRandomValues(new Uint8Array(12)); // 96-bit for GCM is standard
  return crypto.getRandomValues(new Uint8Array(16)); // 128-bit for CBC/CTR
};

export const deriveKey = async (password, salt, iterations = 100000, alg) => {
  const pwdBuffer = textToBuffer(password);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    pwdBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256'
    },
    baseKey,
    { name: alg, length: 256 },
    true, // Extractable so we can show technical details
    ['encrypt', 'decrypt']
  );
};

export const generateSecurePassword = (length = 24) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const values = crypto.getRandomValues(new Uint32Array(length));
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
};

export const encryptAES = async (mode, key, iv, plaintextBuffer) => {
  let params;
  if (mode === 'AES-GCM') {
    params = { name: mode, iv: iv, tagLength: 128 };
  } else if (mode === 'AES-CBC') {
    params = { name: mode, iv: iv };
  } else if (mode === 'AES-CTR') {
    params = { name: mode, counter: iv, length: 64 };
  }

  return await crypto.subtle.encrypt(params, key, plaintextBuffer);
};

export const decryptAES = async (mode, key, iv, ciphertextBuffer) => {
  let params;
  if (mode === 'AES-GCM') {
    params = { name: mode, iv: iv, tagLength: 128 };
  } else if (mode === 'AES-CBC') {
    params = { name: mode, iv: iv };
  } else if (mode === 'AES-CTR') {
    params = { name: mode, counter: iv, length: 64 };
  }
  return await crypto.subtle.decrypt(params, key, ciphertextBuffer);
};
