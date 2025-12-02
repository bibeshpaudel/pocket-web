import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Image as ImageIcon, Settings, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0); // in MB
  const [compressedSize, setCompressedSize] = useState(0); // in MB
  
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(0);

  useEffect(() => {
    if (originalFile) {
      compressImage(originalFile);
    }
  }, [originalFile, targetSizeKB, useCustomSize]);

  const compressImage = async (file) => {
    setIsCompressing(true);
    
    // Determine max size in MB
    let targetMB = originalSize;
    
    if (useCustomSize && targetSizeKB > 0) {
      targetMB = targetSizeKB / 1024;
    } else {
      // Auto mode: Default to 1MB or Original Size, whichever is smaller
      targetMB = Math.min(originalSize, 1); 
    }

    // Initial attempt options
    let options = {
      maxSizeMB: targetMB,
      useWebWorker: true,
      // Removed maxWidthOrHeight to prevent unnecessary downscaling
    };

    try {
      let compressedFile = await imageCompression(file, options);
      
      // Retry logic: If result is still larger than target (with small buffer), try harder
      // Only applies if we are strictly targeting a size (Custom Mode)
      if (useCustomSize && compressedFile.size > targetMB * 1024 * 1024) {
        let attempts = 0;
        let currentMaxSize = targetMB;
        
        while (compressedFile.size > targetMB * 1024 * 1024 && attempts < 3) {
          attempts++;
          // Reduce max size by 10% each attempt to force stronger compression
          currentMaxSize = currentMaxSize * 0.9; 
          options.maxSizeMB = currentMaxSize;
          
          try {
            const retryFile = await imageCompression(file, options);
            // Only keep the new file if it's actually smaller
            if (retryFile.size < compressedFile.size) {
              compressedFile = retryFile;
            }
          } catch (retryError) {
            console.warn("Retry compression failed:", retryError);
            break; 
          }
        }
      }

      setCompressedImage(URL.createObjectURL(compressedFile));
      setCompressedSize(compressedFile.size / 1024 / 1024);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    const sizeMB = imageFile.size / 1024 / 1024;
    setOriginalImage(URL.createObjectURL(imageFile));
    setOriginalFile(imageFile);
    setOriginalSize(sizeMB);
    
    // Initialize target size to original size (in KB)
    setTargetSizeKB(Math.floor(imageFile.size / 1024));
    setUseCustomSize(false); // Reset to Auto on new upload
  };

  const formatSize = (sizeMB) => {
    const sizeKB = sizeMB * 1024;
    return `${sizeMB.toFixed(2)} MB (${sizeKB.toFixed(0)} KB)`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-${originalFile?.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress images locally in your browser without losing quality."
    >
      <div className="space-y-8">
        <div className="flex justify-center">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
              <Upload className="w-12 h-12 mb-4 opacity-50" />
              <p className="mb-2 text-lg font-bold">Click to upload image</p>
              <p className="text-sm opacity-70">PNG, JPG, WEBP up to 10MB</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {originalImage && (
          <div className="space-y-6">
            {/* Settings Panel */}
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium">Compression Settings</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={useCustomSize ? "outline" : "default"}
                    size="sm"
                    onClick={() => setUseCustomSize(false)}
                  >
                    Auto
                  </Button>
                  <Button 
                    variant={useCustomSize ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseCustomSize(true)}
                  >
                    Custom Size
                  </Button>
                </div>
              </div>

              {useCustomSize && (
                <div className="flex items-end gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1 space-y-2">
                    <label htmlFor="targetSize" className="text-sm font-medium leading-none">
                      Target Size (KB)
                    </label>
                    <Input
                      id="targetSize"
                      type="number"
                      min="1"
                      max={Math.floor(originalSize * 1024)}
                      value={targetSizeKB}
                      onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max: {Math.floor(originalSize * 1024)} KB
                    </p>
                  </div>
                  <div className="pb-2 text-sm text-muted-foreground font-mono">
                    ≈ {(targetSizeKB / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Original
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <img src={originalImage} alt="Original" className="w-full h-auto rounded-sm mb-2" />
                    <p className="font-mono text-sm text-muted-foreground">
                      Size: {formatSize(originalSize)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Compressed
                </h3>
                <Card>
                  <CardContent className="p-4">
                    {isCompressing ? (
                      <div className="flex items-center justify-center h-48">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                          <p className="font-bold text-primary">Compressing...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={compressedImage} alt="Compressed" className="w-full h-auto rounded-sm mb-2" />
                        <div className="mb-4 space-y-1">
                          <p className="font-mono text-sm">
                            Size: {formatSize(compressedSize)}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                            Saved: {((1 - compressedSize / originalSize) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
