import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

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
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
              <Upload className="w-12 h-12 mb-4" />
              <p className="mb-2 text-lg font-bold text-foreground">Click to upload image</p>
              <p className="text-sm">Supports PNG, JPG, WEBP, GIF</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {image && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Original
              </h3>
              <Card>
                <CardContent className="p-4">
                  <img src={image} alt="Original" className="w-full h-auto rounded-sm" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Convert To
              </h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/webp">WEBP</option>
                  </select>

                  <Button onClick={convertImage} className="w-full">
                    Convert Image
                  </Button>

                  {convertedImage && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="font-bold mb-2">Preview:</p>
                      <img src={convertedImage} alt="Converted" className="w-full h-auto rounded-sm mb-4" />
                      <Button asChild variant="secondary" className="w-full">
                        <a
                          href={convertedImage}
                          download={`converted-image.${format.split('/')[1]}`}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </div>
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
