import {
  FileJson,
  QrCode,
  Image,
  Lock,
  FileCode,
  Binary,
  Eye,
  Highlighter,
  Hash,
  Shield,
  GitCompare,
  Link,
  Type,
  AlignLeft,
  FileText,
  Fingerprint,
  Scale,
  Clock,
  Globe,
  Regex,
  Network,
  FileDigit
} from 'lucide-react';

export const tools = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON data',
    path: '/json-formatter',
    icon: FileJson,
    category: 'Formatters'
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and validate XML data',
    path: '/xml-formatter',
    icon: FileCode,
    category: 'Formatters'
  },
  {
    id: 'json-to-model',
    name: 'JSON to Model',
    description: 'Generate model classes from JSON',
    path: '/json-to-model',
    icon: FileDigit,
    category: 'Converters'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for text/URLs',
    path: '/qr-generator',
    icon: QrCode,
    category: 'Generators'
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images locally',
    path: '/image-compressor',
    icon: Image,
    category: 'Images'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords',
    path: '/password-generator',
    icon: Lock,
    category: 'Generators'
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Previewer',
    description: 'Preview Markdown in real-time',
    path: '/markdown-preview',
    icon: FileText,
    category: 'Text'
  },
  {
    id: 'base64-converter',
    name: 'Base64 Converter',
    description: 'Encode/Decode Base64 strings',
    path: '/base64-converter',
    icon: Binary,
    category: 'Converters'
  },
  {
    id: 'svg-viewer',
    name: 'SVG Viewer',
    description: 'View and inspect SVG files',
    path: '/svg-viewer',
    icon: Eye,
    category: 'Images'
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert between image formats',
    path: '/image-converter',
    icon: Image,
    category: 'Images'
  },
  {
    id: 'syntax-highlighter',
    name: 'Syntax Highlighter',
    description: 'Highlight code syntax',
    path: '/syntax-highlighter',
    icon: Highlighter,
    category: 'Text'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes',
    path: '/hash-generator',
    icon: Hash,
    category: 'Security'
  },
  {
    id: 'aes-encrypt',
    name: 'AES Encrypt/Decrypt',
    description: 'Encrypt/Decrypt text using AES',
    path: '/aes-encrypt',
    icon: Shield,
    category: 'Security'
  },
  {
    id: 'text-compare',
    name: 'Text Comparison',
    description: 'Compare two text blocks',
    path: '/text-compare',
    icon: GitCompare,
    category: 'Text'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URLs',
    path: '/url-encoder',
    icon: Link,
    category: 'Web'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text case (upper, lower, etc.)',
    path: '/case-converter',
    icon: Type,
    category: 'Text'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, chars, sentences',
    path: '/word-counter',
    icon: AlignLeft,
    category: 'Text'
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    path: '/lorem-ipsum',
    icon: FileText,
    category: 'Generators'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs (v1, v4)',
    path: '/uuid-generator',
    icon: Fingerprint,
    category: 'Generators'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between units',
    path: '/unit-converter',
    icon: Scale,
    category: 'Converters'
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps',
    path: '/timestamp-converter',
    icon: Clock,
    category: 'Converters'
  },
  {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Convert between timezones',
    path: '/timezone-converter',
    icon: Globe,
    category: 'Converters'
  },
  {
    id: 'regex-tester',
    name: 'RegEx Tester',
    description: 'Test regular expressions',
    path: '/regex-tester',
    icon: Regex,
    category: 'Text'
  },
  {
    id: 'ip-lookup',
    name: 'IP & DNS Lookup',
    description: 'Get IP and DNS information',
    path: '/ip-lookup',
    icon: Network,
    category: 'Web'
  }
];
