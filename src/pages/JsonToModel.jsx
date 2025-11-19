import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Trash2, RefreshCw, Check } from 'lucide-react';

export default function JsonToModel() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateModel = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      let generated = '';

      switch (language) {
        case 'typescript':
          generated = generateTypescriptInterface(parsed);
          break;
        case 'csharp':
          generated = generateCSharpClass(parsed);
          break;
        case 'go':
          generated = generateGoStruct(parsed);
          break;
        case 'python':
          generated = generatePythonClass(parsed);
          break;
        case 'java':
          generated = generateJavaClass(parsed);
          break;
        case 'javascript':
          generated = generateJSDoc(parsed);
          break;
        default:
          generated = '';
      }

      setOutput(generated);
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const generateTypescriptInterface = (obj, name = 'RootObject') => {
    let result = `interface ${name} {\n`;
    for (const key in obj) {
      const type = typeof obj[key];
      if (type === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          const itemType = obj[key].length > 0 ? typeof obj[key][0] : 'any';
          result += `  ${key}: ${itemType}[];\n`;
        } else {
          result += `  ${key}: any; // Nested object\n`;
        }
      } else {
        result += `  ${key}: ${type};\n`;
      }
    }
    result += '}';
    return result;
  };

  const generateCSharpClass = (obj, name = 'RootObject') => {
    let result = `public class ${name}\n{\n`;
    for (const key in obj) {
      const type = typeof obj[key];
      let csharpType = 'string';
      if (type === 'number') csharpType = 'int';
      if (type === 'boolean') csharpType = 'bool';
      if (type === 'object') csharpType = 'object';
      
      result += `    public ${csharpType} ${key.charAt(0).toUpperCase() + key.slice(1)} { get; set; }\n`;
    }
    result += '}';
    return result;
  };

  const generateGoStruct = (obj, name = 'RootObject') => {
    let result = `type ${name} struct {\n`;
    for (const key in obj) {
      const type = typeof obj[key];
      let goType = 'string';
      if (type === 'number') goType = 'int';
      if (type === 'boolean') goType = 'bool';
      if (type === 'object') goType = 'interface{}';

      result += `    ${key.charAt(0).toUpperCase() + key.slice(1)} ${goType} \`json:"${key}"\`\n`;
    }
    result += '}';
    return result;
  };

  const generatePythonClass = (obj, name = 'RootObject') => {
    let result = `class ${name}:\n    def __init__(self, data: dict):\n`;
    for (const key in obj) {
      result += `        self.${key} = data.get("${key}")\n`;
    }
    return result;
  };

  const generateJavaClass = (obj, name = 'RootObject') => {
    let result = `public class ${name} {\n`;
    for (const key in obj) {
      const type = typeof obj[key];
      let javaType = 'String';
      if (type === 'number') javaType = 'int';
      if (type === 'boolean') javaType = 'boolean';
      if (type === 'object') javaType = 'Object';
      
      result += `    private ${javaType} ${key};\n`;
    }
    result += `\n    // Getters and Setters omitted for brevity\n}`;
    return result;
  };

  const generateJSDoc = (obj, name = 'RootObject') => {
    let result = `/**\n * @typedef {Object} ${name}\n`;
    for (const key in obj) {
      const type = typeof obj[key];
      result += ` * @property {${type}} ${key}\n`;
    }
    result += ` */`;
    return result;
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
      title="JSON to Model"
      description="Generate model classes/interfaces from JSON for TypeScript, C#, Go, Python, Java, and JS."
    >
      <div className="grid gap-6">
        <div>
          <label className="block font-bold mb-2 text-textSecondary">Input JSON</label>
          <textarea
            className="w-full h-48 font-mono text-sm resize-y"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="font-bold"
          >
            <option value="typescript">TypeScript</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript (JSDoc)</option>
          </select>
          
          <button
            onClick={generateModel}
            className="bg-accent hover:bg-accentHover text-white px-6 py-2 rounded-base font-bold transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Generate
          </button>

          <button
            onClick={clearAll}
            className="bg-slate-800 hover:bg-slate-700 text-text px-4 py-2 rounded-base font-bold transition-colors flex items-center gap-2 border border-white/10"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded-base">
            {error}
          </div>
        )}

        {output && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-2">
              <label className="block font-bold text-textSecondary">Generated Model ({language})</label>
              <button
                onClick={copyToClipboard}
                className="text-sm flex items-center gap-1 hover:text-accent transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-96 font-mono text-sm resize-y"
              value={output}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
