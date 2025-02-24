import { createWorker } from 'tesseract.js';

export async function processImage(file: File) {
  const worker = await createWorker({
    logger: m => console.log(m),
    workerPath: '/worker.min.js',
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4.0.4/tesseract-core.wasm.js',
    workerBlobURL: false,
    cacheMethod: "none"
  });

  try {
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    
    const url = URL.createObjectURL(file);
    const { data } = await worker.recognize(url);
    
    URL.revokeObjectURL(url);
    await worker.terminate();
    
    return data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    if (worker) await worker.terminate();
    throw new Error('Error al procesar la imagen');
  }
}