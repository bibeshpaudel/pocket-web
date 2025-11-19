import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

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
          <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-border dark:border-darkBorder rounded-base bg-bg dark:bg-darkBg cursor-pointer hover:bg-main/20 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
              <div className="bg-bg dark:bg-darkBg p-4 border-2 border-border dark:border-darkBorder rounded-base">
                <img src={originalImage} alt="Original" className="w-full h-auto rounded-sm mb-2" />
                <p className="font-mono text-sm">Size: {originalSize.toFixed(2)} MB</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Compressed
              </h3>
              <div className="bg-bg dark:bg-darkBg p-4 border-2 border-border dark:border-darkBorder rounded-base">
                {isCompressing ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="animate-pulse font-bold">Compressing...</p>
                  </div>
                ) : (
                  <>
                    <img src={compressedImage} alt="Compressed" className="w-full h-auto rounded-sm mb-2" />
                    <p className="font-mono text-sm mb-4">
                      Size: {compressedSize.toFixed(2)} MB 
                      <span className="text-green-600 ml-2">
                        (-{((1 - compressedSize / originalSize) * 100).toFixed(0)}%)
                      </span>
                    </p>
                    <a
                      href={compressedImage}
                      download="compressed-image.jpg"
                      className="flex items-center justify-center gap-2 w-full bg-main text-text px-4 py-2 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
