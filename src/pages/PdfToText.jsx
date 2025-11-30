import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Upload, FileText, Copy, Check, AlertCircle } from 'lucide-react';

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfToText() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);

  const extractText = async (file) => {
    setLoading(true);
    setError('');
    setText('');
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setText(fullText);
    } catch (err) {
      console.error(err);
      setError('Failed to extract text from PDF. The file might be password protected or corrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        return;
      }
      extractText(file);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <ToolLayout
      title="PDF to Text"
      description="Extract text content from PDF files locally."
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-card/50 transition-colors relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Upload size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {fileName ? fileName : 'Drop PDF here or click to upload'}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                All processing happens in your browser
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 text-muted-foreground animate-pulse">
            Extracting text from PDF...
          </div>
        )}

        {/* Result Section */}
        {text && !loading && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">Extracted Text</label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea
              value={text}
              readOnly
              className="w-full h-[500px] p-4 bg-card border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
