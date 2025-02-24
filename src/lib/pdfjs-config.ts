import * as pdfjs from 'pdfjs-dist';

// La ruta al worker
const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Configurar el worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export { pdfjs };