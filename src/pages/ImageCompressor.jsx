import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    setOriginalImage(URL.createObjectURL(imageFile));
    setOriginalSize(imageFile.size / 1024 / 1024);
    setIsCompressing(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      setCompressedImage(URL.createObjectURL(compressedFile));
      setCompressedSize(compressedFile.size / 1024 / 1024);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCompressing(false);
    }
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
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Original
              </h3>
              <Card>
                <CardContent className="p-4">
                  <img src={originalImage} alt="Original" className="w-full h-auto rounded-sm mb-2" />
                  <p className="font-mono text-sm text-muted-foreground">Size: {originalSize.toFixed(2)} MB</p>
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
                      <p className="animate-pulse font-bold text-primary">Compressing...</p>
                    </div>
                  ) : (
                    <>
                      <img src={compressedImage} alt="Compressed" className="w-full h-auto rounded-sm mb-2" />
                      <p className="font-mono text-sm mb-4">
                        Size: {compressedSize.toFixed(2)} MB 
                        <span className="text-green-600 dark:text-green-400 ml-2 font-bold">
                          (-{((1 - compressedSize / originalSize) * 100).toFixed(0)}%)
                        </span>
                      </p>
                      <Button asChild className="w-full">
                        <a
                          href={compressedImage}
                          download="compressed-image.jpg"
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
