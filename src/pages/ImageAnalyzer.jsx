import React, { useState, useEffect, useRef } from 'react';
import ExifReader from 'exifreader';
import ToolLayout from '../components/ToolLayout';
import { Upload, Camera, MapPin, Activity, Image as ImageIcon, Focus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import ImageWorker from '../workers/imageWorker.js?worker';

export default function ImageAnalyzer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [fileName, setFileName] = useState('');
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  
  // Results
  const [metadata, setMetadata] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [sobelData, setSobelData] = useState(null);
  const [elaData, setElaData] = useState(null);
  
  // Canvas Refs
  const loadCanvasRef = useRef(null);
  const histCanvasRef = useRef(null);
  const sobelCanvasRef = useRef(null);
  const elaCanvasRef = useRef(null);
  
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new ImageWorker();
    
    workerRef.current.onmessage = (e) => {
      const { type, result, error, id } = e.data;
      if (error) {
        console.error("Worker error:", error);
        return;
      }
      
      if (type === 'ANALYZE_IMAGE') {
        setAnalysis(prev => ({ ...prev, ...result }));
        setProcessingStage('Generating Edge Map...');
        workerRef.current.postMessage({ type: 'COMPUTE_SOBEL', payload: { imageData: prevImageData.current }, id: 'sobel' });
      } else if (type === 'COMPUTE_SOBEL') {
        const u8 = new Uint8ClampedArray(result.buffer);
        setSobelData(new ImageData(u8, result.width, result.height));
        setProcessingStage('Generating Error Level Analysis...');
        performELA();
      } else if (type === 'COMPUTE_ELA') {
        const u8 = new Uint8ClampedArray(result.buffer);
        setElaData(new ImageData(u8, result.width, result.height));
        setProcessingStage('');
        setIsProcessing(false);
      }
    };
    
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  // Use a ref to hold image data across worker calls
  const prevImageData = useRef(null);

  const performELA = () => {
    // We need to resave the canvas at 0.90 quality and get its ImageData to pass to worker
    const canvas = loadCanvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const compressedData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        workerRef.current.postMessage({
          type: 'COMPUTE_ELA',
          payload: { imageData: prevImageData.current, compressedData: compressedData },
          id: 'ela'
        });
      };
      img.src = URL.createObjectURL(blob);
    }, 'image/jpeg', 0.90);
  };



  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setOriginalImage(URL.createObjectURL(file));
    setIsProcessing(true);
    setProcessingStage('Extracting Metadata...');
    setMetadata(null);
    setGpsData(null);
    setAnalysis(null);
    setSobelData(null);
    setElaData(null);

    try {
      // 1. ExifReader
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);
      
      const meta = {};
      if (tags['Make']) meta.make = tags['Make'].description;
      if (tags['Model']) meta.model = tags['Model'].description;
      if (tags['ISOSpeedRatings']) meta.iso = tags['ISOSpeedRatings'].description;
      if (tags['FocalLength']) meta.focalLength = tags['FocalLength'].description;
      if (tags['FNumber']) meta.aperture = tags['FNumber'].description;
      if (tags['ExposureTime']) meta.shutterSpeed = tags['ExposureTime'].description;
      if (tags['Software']) meta.software = tags['Software'].description;
      
      setMetadata(meta);

      if (tags['GPSLatitude'] && tags['GPSLongitude']) {
        setGpsData({
          lat: tags['GPSLatitude'].description,
          lon: tags['GPSLongitude'].description
        });
      }

      // 2. Load into canvas to get pixel data
      const img = new Image();
      img.onload = () => {
        const canvas = loadCanvasRef.current;
        const targetWidth = Math.min(img.width, 1200); // Scale down for speed if super large
        const scale = targetWidth / img.width;
        const targetHeight = img.height * scale;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        prevImageData.current = imageData;
        
        setProcessingStage('Analyzing Pixels & Histogram...');
        workerRef.current.postMessage({ type: 'ANALYZE_IMAGE', payload: { imageData }, id: 'analyze' });
      };
      img.src = URL.createObjectURL(file);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isProcessing && analysis?.histogram && histCanvasRef.current) {
      const canvas = histCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, w, h);
      
      const histData = analysis.histogram;
      let max = 0;
      for(let i=0; i<256; i++) {
         max = Math.max(max, histData.r[i], histData.g[i], histData.b[i]);
      }
      
      const drawChannel = (data, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(0, h - (data[0]/max)*h);
        for(let i=1; i<256; i++) {
           ctx.lineTo((i/256)*w, h - (data[i]/max)*h);
        }
        ctx.stroke();
      };
      
      ctx.globalCompositeOperation = "screen";
      drawChannel(histData.r, 'rgba(255, 50, 50, 0.8)');
      drawChannel(histData.g, 'rgba(50, 255, 50, 0.8)');
      drawChannel(histData.b, 'rgba(50, 50, 255, 0.8)');
      ctx.globalCompositeOperation = "source-over";
      drawChannel(histData.l, 'rgba(255, 255, 255, 0.6)');
    }
  }, [analysis?.histogram, isProcessing]);

  useEffect(() => {
    if (!isProcessing && sobelData && sobelCanvasRef.current) {
      sobelCanvasRef.current.width = sobelData.width;
      sobelCanvasRef.current.height = sobelData.height;
      sobelCanvasRef.current.getContext('2d').putImageData(sobelData, 0, 0);
    }
  }, [sobelData, isProcessing]);

  useEffect(() => {
    if (!isProcessing && elaData && elaCanvasRef.current) {
      elaCanvasRef.current.width = elaData.width;
      elaCanvasRef.current.height = elaData.height;
      elaCanvasRef.current.getContext('2d').putImageData(elaData, 0, 0);
    }
  }, [elaData, isProcessing]);

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const getContrastColor = (r, g, b) => {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

  return (
    <ToolLayout
      title="Image Analyzer"
      description="Advanced client-side image forensics and metadata extraction. No external APIs used."
    >
      <div className="space-y-8">
        <div className="flex justify-center">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
              <Upload className="w-12 h-12 mb-4 opacity-50" />
              <p className="mb-2 text-lg font-bold">Click to upload image</p>
              <p className="text-sm opacity-70">JPEG, PNG, WEBP (Client-Side Only)</p>
            </div>
            <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Hidden canvas used for reading image data */}
        <canvas ref={loadCanvasRef} className="hidden" />

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-12 text-primary animate-pulse">
            <RefreshCw className="w-10 h-10 animate-spin mb-4" />
            <p className="text-lg font-medium">{processingStage}</p>
          </div>
        )}

        {originalImage && !isProcessing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Image View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={originalImage} alt="Original" className="w-full rounded-md object-contain border bg-black/5" />
                  <p className="text-xs text-muted-foreground mt-2 truncate text-center">{fileName}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="w-5 h-5" /> EXIF Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {metadata && Object.keys(metadata).length > 0 ? (
                      Object.entries(metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-1 last:border-0 border-border/50">
                          <span className="font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-right truncate ml-4" title={value}>{value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No EXIF data found.</p>
                    )}
                  </div>
                  
                  {gpsData && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium flex items-center gap-2 mb-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-500" /> GPS Location
                      </h4>
                      <p className="text-xs font-mono mb-2">{gpsData.lat}, {gpsData.lon}</p>
                      <div className="flex gap-4">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${gpsData.lat},${gpsData.lon}`} 
                          target="_blank" rel="noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Google Maps
                        </a>
                        <a 
                          href={`https://www.openstreetmap.org/?mlat=${gpsData.lat}&mlon=${gpsData.lon}&zoom=15`} 
                          target="_blank" rel="noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          OpenStreetMap
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {analysis && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-500" /> RGB Histogram
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-black rounded-lg p-2 h-[200px] w-full flex items-center justify-center">
                           <canvas ref={histCanvasRef} width={800} height={400} className="w-full h-full object-fill mix-blend-screen" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Color Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Dominant Colors (Median Cut)</p>
                            <div className="flex h-12 rounded overflow-hidden">
                              {analysis.palette.map((color, i) => {
                                const hex = rgbToHex(color[0], color[1], color[2]);
                                return (
                                  <div 
                                    key={i} 
                                    className="flex-1 flex items-end justify-center pb-1 text-[10px] font-mono hover:flex-[1.5] transition-all cursor-pointer"
                                    style={{ backgroundColor: hex, color: getContrastColor(color[0], color[1], color[2]) }}
                                    title={hex}
                                  >
                                    {hex.toUpperCase()}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded p-3 flex flex-col items-center justify-center">
                               <p className="text-xs text-muted-foreground mb-1">Average Color</p>
                               <div className="w-10 h-10 rounded-full border shadow-sm mb-1" 
                                    style={{ backgroundColor: rgbToHex(analysis.averageColor[0], analysis.averageColor[1], analysis.averageColor[2]) }}></div>
                               <span className="text-xs font-mono">{rgbToHex(...analysis.averageColor)}</span>
                            </div>
                            <div className="border rounded p-3 flex flex-col items-center justify-center">
                               <p className="text-xs text-muted-foreground mb-1">Luminance / Brightness</p>
                               <span className="text-2xl font-bold">{Math.round(analysis.averageLuminance)}</span>
                               <span className="text-[10px] text-muted-foreground">Range: 0 - 255</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Focus className="w-5 h-5 text-orange-500" /> Forensic Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Focus / Sharpness Score (Laplacian Variance):</p>
                          <div className="flex items-end gap-2 mt-1">
                             <span className="text-3xl font-bold text-primary">{Math.round(analysis.sharpness)}</span>
                             <span className="text-sm font-medium mb-1 text-muted-foreground">
                               {analysis.sharpness < 100 ? '(Likely Blurry)' : '(Sharp)'}
                             </span>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                         <div>
                            <p className="font-semibold mb-2">Sobel Edge Detection</p>
                            <div className="bg-black rounded-lg overflow-hidden border border-muted aspect-video flex items-center justify-center">
                               <canvas ref={sobelCanvasRef} className="max-w-full max-h-full object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-center">Highlights stark contrasts & object skeletons.</p>
                         </div>
                         <div>
                            <p className="font-semibold mb-2">Error Level Analysis (ELA)</p>
                            <div className="bg-black rounded-lg overflow-hidden border border-muted aspect-video flex items-center justify-center">
                               <canvas ref={elaCanvasRef} className="max-w-full max-h-full object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-center">Highlights differential compression (photoshopped boundaries).</p>
                         </div>
                       </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
