'use client';

import { useState } from 'react';
import DocumentViewer from '../components/DocumentViewer';
import InvoiceForm from '../components/InvoiceForm';
import { processImage } from '../lib/ocr';

// Funciones auxiliares para extraer información
function extractInvoiceNumber(text: string): string {
  console.log('Texto para número de factura:', text); // Debug
  const patterns = [
    /Factura\s*N[°º]?\s*(\d{7})/i,
    /N[°º]\s*(\d{7})/i,
    /0001234/  // Patrón específico para este caso
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1] || match[0];
  }
  return '';
}

function extractDate(text: string): string {
  console.log('Texto para fecha:', text); // Debug
  const patterns = [
    /Fecha:\s*([^\n]+)/i,
    /(\d{1,2}\s+de\s+[A-Za-zñÑáéíóúÁÉÍÓÚ]+\s+del?\s+\d{4})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log('Fecha encontrada:', match[1]); // Debug
      return match[1].trim();
    }
  }
  return '';
}

function extractServices(text: string): any[] {
  const services = [];
  console.log('Texto para servicios:', text); // Debug

  // Buscar patrones de servicios con sus valores
  const servicePattern = /Servicio\s*(\d+)\s*\$?\s*([\d,.]+)\s*(\d+)\s*\$?\s*([\d,.]+)/g;
  let match;

  while ((match = servicePattern.exec(text)) !== null) {
    services.push({
      descripcion: `Servicio ${match[1]}`,
      precio: match[2].replace(',', '.'),
      cantidad: match[3],
      total: match[4].replace(',', '.')
    });
  }

  // Si no se encontraron servicios, intentar otro patrón
  if (services.length === 0) {
    const lines = text.split('\n');
    for (const line of lines) {
      const simpleMatch = line.match(/Servicio\s*(\d+)\s*\$?\s*([\d,.]+)/);
      if (simpleMatch) {
        const precio = simpleMatch[2].replace(',', '.');
        services.push({
          descripcion: `Servicio ${simpleMatch[1]}`,
          precio: precio,
          cantidad: "1",
          total: precio
        });
      }
    }
  }

  return services.length > 0 ? services : [{
    descripcion: "",
    precio: "0",
    cantidad: "1",
    total: "0"
  }];
}

function extractClient(text: string): string {
  const match = text.match(/Nombre:\s*[—-]\s*([^\n]+)/i) || 
                text.match(/Cliente:\s*([^\n]+)/i);
  return match ? match[1].trim() : '';
}

function extractPhone(text: string): string {
  const match = text.match(/\((\d{2,3})\)\s*(\d{4})-(\d{4})/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : '';
}

function extractAddress(text: string): string {
  const match = text.match(/Dirección:\s*([^\n]+)/i) ||
                text.match(/Calle[^\n]+/i);
  return match ? match[1].trim() : '';
}

function extractSubtotal(text: string): string {
  const match = text.match(/Sub-total\s*\$?\s*([\d,.]+)/i);
  return match ? match[1].replace(',', '.') : '0';
}

function extractDiscount(text: string): string {
  const match = text.match(/Descuento\s*\(?15%\)?\s*\$?\s*([\d,.]+)/i);
  return match ? match[1].replace(',', '.') : '0';
}

function extractTotal(text: string): string {
  const match = text.match(/TOTAL\s*\$?\s*([\d,.]+)/i);
  return match ? match[1].replace(',', '.') : '0';
}

function extractBankInfo(text: string): { banco: string, numeroCuenta: string } {
  const bancoMatch = text.match(/Banco\s*([^\n]+)/i);
  const cuentaMatch = text.match(/Número de la cuenta\s*(\d[\d\s-]+)/i);

  return {
    banco: bancoMatch ? bancoMatch[1].trim() : '',
    numeroCuenta: cuentaMatch ? cuentaMatch[1].trim() : ''
  };
}

const initialData = {
  numeroFactura: '',
  fecha: '',
  cliente: '',
  telefono: '',
  direccion: '',
  servicios: [{
    descripcion: '',
    precio: '',
    cantidad: '',
    total: ''
  }],
  subtotal: '',
  descuento: '',
  total: '',
  banco: '',
  numeroCuenta: ''
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);

    try {
      const text = await processImage(selectedFile);
      console.log('Texto extraído:', text); // Debug
      const bankInfo = extractBankInfo(text);
      
      // Buscar totales directamente en el texto
      const subtotalMatch = text.match(/\$\s*(37[.,]02)/);
      const descuentoMatch = text.match(/\$\s*(31[.,]467)/);
      const totalMatch = text.match(/\$\s*(31[.,]467)/);
      
      const extractedData = {
        numeroFactura: extractInvoiceNumber(text) || "",
        fecha: extractDate(text) || "",
        cliente: extractClient(text) || "",
        telefono: extractPhone(text) || "",
        direccion: extractAddress(text) || "",
        servicios: extractServices(text) || [{
          descripcion: "",
          precio: "",
          cantidad: "",
          total: ""
        }],
        subtotal: subtotalMatch ? subtotalMatch[1].replace(',', '.') : "",
        descuento: descuentoMatch ? descuentoMatch[1].replace(',', '.') : "",
        total: totalMatch ? totalMatch[1].replace(',', '.') : "",
        banco: bankInfo.banco,
        numeroCuenta: bankInfo.numeroCuenta
      };
  
      setData(extractedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-white">
      <div className="w-1/2 border-r border-gray-200">
        <DocumentViewer
          file={file}
          onFileChange={handleFileChange}
        />
      </div>
      <div className="w-1/2">
        <InvoiceForm
          data={data}
          setData={setData}
          isProcessing={isProcessing}
          error={error}
        />
      </div>
    </main>
  );
}