import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Upload, Eye, Code, Download, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';

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
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors">Click to upload SVG</p>
                <p className="text-sm text-muted-foreground mt-2">or paste code below</p>
              </div>
              <input type="file" className="hidden" accept=".svg" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <div className="flex justify-end gap-4">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button
              variant="destructive"
              onClick={() => { setSvgContent(''); setFileName('image.svg'); }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col h-full space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
              <Code className="w-5 h-5" /> Source Code
            </h3>
            <Textarea
              value={svgContent}
              onChange={(e) => setSvgContent(e.target.value)}
              placeholder="Paste SVG code here..."
              className="flex-grow min-h-[400px] font-mono text-sm resize-none"
            />
          </div>

          <div className="flex flex-col h-full space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
              <Eye className="w-5 h-5" /> Preview
            </h3>
            <Card className="flex-grow min-h-[400px] overflow-hidden">
              <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-800/50 p-8 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                {svgContent ? (
                  <div dangerouslySetInnerHTML={{ __html: svgContent }} className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:h-auto [&>svg]:w-auto z-10" />
                ) : (
                  <p className="text-muted-foreground opacity-50 font-bold z-10">Preview will appear here</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
