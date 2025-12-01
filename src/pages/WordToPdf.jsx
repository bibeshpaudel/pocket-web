import React, { useState, useRef } from 'react';
import ToolLayout from '../components/ToolLayout';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Upload, FileText, Download, Loader2, AlertCircle, FileType } from 'lucide-react';

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setError('');
    setHtmlContent('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
        if (result.messages.length > 0) {
            console.warn("Mammoth messages:", result.messages);
        }
      } catch (err) {
        console.error("Conversion error:", err);
        setError("Failed to convert Word file. Please ensure it's a valid .docx file.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    
    setIsProcessing(true);
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const element = previewRef.current;
        
        // Calculate scale to fit A4 width (595.28 pt) with margins
        const a4Width = 595.28;
        const margin = 40;
        const contentWidth = a4Width - (margin * 2);
        const elementWidth = element.offsetWidth;
        const scale = contentWidth / elementWidth;

        await doc.html(element, {
            callback: function(pdf) {
                pdf.save(`${file.name.replace(/\.docx?$/, '')}.pdf`);
                setIsProcessing(false);
            },
            x: margin,
            y: margin,
            html2canvas: {
                scale: scale, // Scale to fit width
                useCORS: true,
                logging: false
            },
            width: contentWidth,
            windowWidth: elementWidth, // Important for correct CSS rendering
            autoPaging: 'text' // Prevent cutting text in half
        });
        
    } catch (err) {
        console.error("PDF Generation error:", err);
        setError("Failed to generate PDF.");
        setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Word to PDF Converter"
      description="Convert Word documents (.docx) to PDF."
    >
      <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] gap-6">
        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                    <FileText size={48} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Upload Word Document</h3>
                    <p className="text-sm text-muted-foreground mt-1">Select a .docx file to convert</p>
                </div>
                
                <label className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer font-medium ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload size={18} />
                    Choose File
                    <input 
                        type="file" 
                        accept=".docx" 
                        onChange={handleFileUpload} 
                        disabled={isProcessing}
                        className="hidden" 
                    />
                </label>
            </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
            </div>
        )}

        {/* Preview & Action */}
        {htmlContent && (
            <div className="flex flex-col gap-4 flex-grow overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                        <FileType className="text-blue-500" size={24} />
                        <div>
                            <p className="font-medium">{file?.name}</p>
                            <p className="text-xs text-muted-foreground">Ready to convert</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleDownloadPdf}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        Download PDF
                    </button>
                </div>

                <div className="flex-grow overflow-auto border border-border rounded-lg bg-white p-8 shadow-inner">
                    <div 
                        ref={previewRef}
                        className="prose max-w-none text-black [&_p]:break-inside-avoid [&_h1]:break-after-avoid [&_h2]:break-after-avoid [&_h3]:break-after-avoid [&_h4]:break-after-avoid [&_h5]:break-after-avoid [&_h6]:break-after-avoid"
                        dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    />
                </div>
            </div>
        )}
      </div>
    </ToolLayout>
  );
}
