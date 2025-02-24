import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se subió ningún archivo' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Initialize Tesseract worker with browser configuration
    const worker = await createWorker({
      workerPath: 'https://unpkg.com/tesseract.js@v5.0.5/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
      logger: m => console.log(m)
    });

    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    
    const { data: { text } } = await worker.recognize(dataUrl);
    await worker.terminate();

    // Aquí puedes implementar la lógica para extraer información específica
    const data = {
      numeroFactura: extractInvoiceNumber(text) || "",
      fecha: extractDate(text) || "",
      cliente: extractClient(text) || "",
      telefono: extractPhone(text) || "",
      direccion: extractAddress(text) || "",
      servicios: extractServices(text) || [{
        descripcion: "",
        precio: "0",
        cantidad: "1",
        total: "0"
      }],
      subtotal: "0",
      descuento: "0",
      total: "0",
      banco: "",
      numeroCuenta: ""
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: 'Error al procesar el documento' },
      { status: 500 }
    );
  }
}

// Funciones auxiliares para extraer información
function extractInvoiceNumber(text: string): string {
  // Implementar lógica de extracción
  const match = text.match(/factura[:\s]+(\d+)/i);
  return match ? match[1] : '';
}

function extractDate(text: string): string {
  // Implementar lógica de extracción
  const match = text.match(/fecha[:\s]+([\d\/\-]+)/i);
  return match ? match[1] : '';
}

function extractClient(text: string): string {
  // Implementar lógica de extracción
  const match = text.match(/cliente[:\s]+([^\n]+)/i);
  return match ? match[1].trim() : '';
}

function extractPhone(text: string): string {
  // Implementar lógica de extracción
  const match = text.match(/tel[éefonoéf]+[:\s]+([\d\-\(\)\s]+)/i);
  return match ? match[1].trim() : '';
}

function extractAddress(text: string): string {
  // Implementar lógica de extracción
  const match = text.match(/direcci[óo]n[:\s]+([^\n]+)/i);
  return match ? match[1].trim() : '';
}

function extractServices(text: string): any[] {
  // Esta función necesitará una implementación más compleja
  // dependiendo del formato de tu factura
  return [{
    descripcion: "",
    precio: "0",
    cantidad: "1",
    total: "0"
  }];
}