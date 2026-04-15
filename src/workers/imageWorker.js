self.onmessage = function (e) {
  const { type, payload, id } = e.data;
  
  try {
    let result;
    switch (type) {
      case 'ANALYZE_IMAGE':
        result = analyzeImage(payload.imageData);
        break;
      case 'COMPUTE_SOBEL':
        result = computeSobel(payload.imageData);
        break;
      case 'COMPUTE_ELA':
        result = computeELA(payload.imageData, payload.compressedData);
        break;
      default:
        throw new Error('Unknown command');
    }
    self.postMessage({ id, type, result });
  } catch (err) {
    self.postMessage({ id, type, error: err.message || err.toString() });
  }
};

function analyzeImage(imageData) {
  const data = imageData.data;
  const length = data.length;
  
  // Histogram arrays
  const hist = {
    r: new Array(256).fill(0),
    g: new Array(256).fill(0),
    b: new Array(256).fill(0),
    l: new Array(256).fill(0)
  };

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalLuminance = 0;

  // We will downsample for color palette if the image is huge, but histogram should count everything or stride small.
  const pixels = [];
  const pixelStride = Math.max(4, Math.floor(length / (40000 * 4)) * 4); // sample ~40,000 pixels for palette

  for (let i = 0; i < length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived Luminance
    const luma = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    hist.r[r]++;
    hist.g[g]++;
    hist.b[b]++;
    hist.l[luma]++;

    totalR += r;
    totalG += g;
    totalB += b;
    totalLuminance += luma;

    if (i % pixelStride === 0) {
      pixels.push([r, g, b]);
    }
  }

  const pixelCount = length / 4;
  
  const avgColor = [
    Math.round(totalR / pixelCount),
    Math.round(totalG / pixelCount),
    Math.round(totalB / pixelCount)
  ];
  
  const avgLuminance = totalLuminance / pixelCount;
  const sharpness = computeLaplacianVariance(imageData);
  const palette = calculateMedianCut(pixels, 5);

  return {
    histogram: hist,
    averageColor: avgColor,
    averageLuminance: avgLuminance,
    sharpness: sharpness,
    palette: palette
  };
}

// Compute variance of Laplacian for focus checking
function computeLaplacianVariance(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Apply a simplified 3x3 Laplacian filter [0 1 0, 1 -4 1, 0 1 0]
  // To speed up, we look at luminance only and maybe stride
  
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  
  // To keep it fast, we don't need every pixel for variance, sample every other row/col
  const stride = 2;

  for (let y = 1; y < height - 1; y += stride) {
    for (let x = 1; x < width - 1; x += stride) {
      const idx = (y * width + x) * 4;
      
      const v01 = 0.299*data[idx - width*4] + 0.587*data[idx - width*4 + 1] + 0.114*data[idx - width*4 + 2];
      const v10 = 0.299*data[idx - 4] + 0.587*data[idx - 3] + 0.114*data[idx - 2];
      const v11 = 0.299*data[idx] + 0.587*data[idx+1] + 0.114*data[idx+2];
      const v12 = 0.299*data[idx + 4] + 0.587*data[idx + 5] + 0.114*data[idx + 6];
      const v21 = 0.299*data[idx + width*4] + 0.587*data[idx + width*4 + 1] + 0.114*data[idx + width*4 + 2];
      
      let laplacian = v01 + v10 + v12 + v21 - (4 * v11);
      
      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  const variance = (sumSq / count) - (mean * mean);
  return variance;
}


function computeSobel(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // We cannot use OffscreenCanvas in all workers easily, so we manually create a new Uint8ClampedArray
  const outputData = new Uint8ClampedArray(data.length);
  
  const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pIdx = (y * width + x) * 4;
      
      let pixelX = 0;
      let pixelY = 0;
      
      for (let cy = -1; cy <= 1; cy++) {
        for (let cx = -1; cx <= 1; cx++) {
          const cidx = ((y + cy) * width + (x + cx)) * 4;
          // use luminance
          const luma = 0.299 * data[cidx] + 0.587 * data[cidx + 1] + 0.114 * data[cidx + 2];
          const kIdx = (cy + 1) * 3 + (cx + 1);
          
          pixelX += luma * kernelX[kIdx];
          pixelY += luma * kernelY[kIdx];
        }
      }
      
      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY) >>> 0;
      const clamped = magnitude > 255 ? 255 : magnitude;
      
      outputData[pIdx] = clamped;
      outputData[pIdx + 1] = clamped;
      outputData[pIdx + 2] = clamped;
      outputData[pIdx + 3] = 255;
    }
  }
  
  // Fill borders with black
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        const pIdx = (y * width + x) * 4;
        outputData[pIdx] = 0;
        outputData[pIdx+1] = 0;
        outputData[pIdx+2] = 0;
        outputData[pIdx+3] = 255;
      }
    }
  }

  return { buffer: outputData.buffer, width, height }; // return buffer to use in new ImageData on main thread
}

function computeELA(imgData1, imgData2) {
  const length = imgData1.data.length;
  const d1 = imgData1.data;
  const d2 = imgData2.data;

  const outputData = new Uint8ClampedArray(length);

  // ELA multiplies the difference to make it visible, usually x20 is good.
  const scale = 20;

  for (let i = 0; i < length; i += 4) {
    const diffR = Math.abs(d1[i] - d2[i]) * scale;
    const diffG = Math.abs(d1[i+1] - d2[i+1]) * scale;
    const diffB = Math.abs(d1[i+2] - d2[i+2]) * scale;

    outputData[i] = diffR > 255 ? 255 : diffR;
    outputData[i+1] = diffG > 255 ? 255 : diffG;
    outputData[i+2] = diffB > 255 ? 255 : diffB;
    outputData[i+3] = 255;
  }

  return { buffer: outputData.buffer, width: imgData1.width, height: imgData1.height };
}

// Simple Median Cut adapted for JS
function calculateMedianCut(pixels, depth) {
  // Returns top 5-8 colors based on depth (we target ~5 but depth=3 gives 8 boxes)
  // depth=3 gives 8 clusters
  let boxes = [pixels];
  
  for (let i = 0; i < 3; i++) { // depth 3 = 8 boxes
    const newBoxes = [];
    for (const box of boxes) {
      if (box.length === 0) continue;
      
      let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
      for (const p of box) {
        if (p[0] < minR) minR = p[0];
        if (p[0] > maxR) maxR = p[0];
        if (p[1] < minG) minG = p[1];
        if (p[1] > maxG) maxG = p[1];
        if (p[2] < minB) minB = p[2];
        if (p[2] > maxB) maxB = p[2];
      }
      
      const rangeR = maxR - minR;
      const rangeG = maxG - minG;
      const rangeB = maxB - minB;
      
      let sortAxis = 0; // 0=R, 1=G, 2=B
      if (rangeG >= rangeR && rangeG >= rangeB) sortAxis = 1;
      else if (rangeB >= rangeR && rangeB >= rangeG) sortAxis = 2;
      
      box.sort((a, b) => a[sortAxis] - b[sortAxis]);
      const mid = Math.floor(box.length / 2);
      newBoxes.push(box.slice(0, mid));
      newBoxes.push(box.slice(mid));
    }
    boxes = newBoxes;
  }
  
  // Calculate average of each box
  const palette = boxes.map(box => {
    if (box.length === 0) return null;
    let r = 0, g = 0, b = 0;
    for (const p of box) {
      r += p[0]; g += p[1]; b += p[2];
    }
    return [
      Math.round(r / box.length),
      Math.round(g / box.length),
      Math.round(b / box.length)
    ];
  }).filter(c => c !== null);

  // Take top 5 boxes by sort of frequency or spread. Let's just return first 5 distinct colors.
  // Sort boxes by volume or just return top 5
  return palette.slice(0, 5);
}
