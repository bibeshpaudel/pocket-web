import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

export default function ImageConverter() {
  const [image, setImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [format, setFormat] = useState('image/png');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setConvertedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = () => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const converted = canvas.toDataURL(format);
      setConvertedImage(converted);
    };
    img.src = image;
  };

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images between different formats (PNG, JPG, WEBP)."
    >
      <div className="grid gap-8">
        <div className="flex justify-center">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-base bg-slate-900/30 cursor-pointer hover:bg-slate-900/50 hover:border-accent/50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-4 text-textSecondary" />
              <p className="mb-2 text-lg font-bold text-text">Click to upload image</p>
              <p className="text-sm text-textSecondary">Supports PNG, JPG, WEBP, GIF</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {image && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-text">
                <ImageIcon className="w-5 h-5" /> Original
              </h3>
              <div className="bg-slate-900/50 p-4 border border-white/10 rounded-base">
                <img src={image} alt="Original" className="w-full h-auto rounded-sm" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-text">
                <ImageIcon className="w-5 h-5" /> Convert To
              </h3>
              <div className="bg-slate-900/50 p-4 border border-white/10 rounded-base space-y-4">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full font-bold"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WEBP</option>
                </select>

                <button
                  onClick={convertImage}
                  className="w-full bg-accent hover:bg-accentHover text-white px-6 py-3 rounded-base transition-colors font-bold"
                >
                  Convert Image
                </button>

                {convertedImage && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="font-bold mb-2 text-text">Preview:</p>
                    <img src={convertedImage} alt="Converted" className="w-full h-auto rounded-sm mb-4" />
                    <a
                      href={convertedImage}
                      download={`converted-image.${format.split('/')[1]}`}
                      className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-text px-4 py-2 border border-white/10 rounded-base transition-colors font-bold"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
