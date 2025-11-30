import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { PDFDocument } from 'pdf-lib';
import { Upload, File, Trash2, ArrowUp, ArrowDown, Download, Plus, AlertCircle } from 'lucide-react';

export default function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (newFiles.length === 0) return;
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to merge PDFs. One or more files might be corrupted.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDFs"
      description="Combine multiple PDF files into one document."
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-card/50 transition-colors relative">
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Plus size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Add PDF Files
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Drag & drop or click to upload
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

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground px-2">
              <span>{files.length} files selected</span>
              <button 
                onClick={() => setFiles([])}
                className="text-red-500 hover:text-red-400"
              >
                Clear All
              </button>
            </div>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-muted rounded">
                      <File size={20} className="text-muted-foreground" />
                    </div>
                    <span className="truncate font-medium text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      className="p-1.5 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 hover:bg-red-500/10 text-red-500 rounded ml-2"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={mergePdfs}
            disabled={files.length < 2 || processing}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? (
              <>Processing...</>
            ) : (
              <>
                <Download size={20} />
                Merge & Download
              </>
            )}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
