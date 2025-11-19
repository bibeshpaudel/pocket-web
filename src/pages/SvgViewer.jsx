import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Upload, Eye, Code, Download, Trash2 } from 'lucide-react';

export default function SvgViewer() {
  const [svgContent, setSvgContent] = useState('');
  const [fileName, setFileName] = useState('image.svg');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvgContent(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid SVG file');
    }
  };

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'edited-image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="SVG Viewer & Editor"
      description="View, edit, and inspect SVG files in real-time."
    >
      <div className="grid gap-8">
        {!svgContent ? (
          <div className="flex justify-center">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-base bg-slate-900/50 cursor-pointer hover:bg-slate-800/50 transition-colors group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-textSecondary group-hover:text-accent transition-colors" />
                <p className="text-lg font-bold text-textSecondary group-hover:text-text transition-colors">Click to upload SVG</p>
                <p className="text-sm text-textSecondary mt-2">or paste code below</p>
              </div>
              <input type="file" className="hidden" accept=".svg" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <div className="flex justify-end gap-4">
            <button
              onClick={handleDownload}
              className="bg-accent hover:bg-accentHover text-white px-6 py-2 rounded-base transition-colors font-bold flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Download
            </button>
            <button
              onClick={() => { setSvgContent(''); setFileName('image.svg'); }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-6 py-2 border border-red-500/50 rounded-base transition-colors font-bold flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> Clear
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-textSecondary">
              <Code className="w-5 h-5" /> Source Code
            </h3>
            <textarea
              value={svgContent}
              onChange={(e) => setSvgContent(e.target.value)}
              placeholder="Paste SVG code here..."
              className="w-full flex-grow min-h-[400px] p-4 bg-slate-900/50 border border-white/10 rounded-base font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-none text-text"
            />
          </div>

          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-textSecondary">
              <Eye className="w-5 h-5" /> Preview
            </h3>
            <div className="bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-800/50 p-8 border border-white/10 rounded-base flex items-center justify-center flex-grow min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
              {svgContent ? (
                <div dangerouslySetInnerHTML={{ __html: svgContent }} className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:h-auto [&>svg]:w-auto" />
              ) : (
                <p className="text-textSecondary opacity-50 font-bold">Preview will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
