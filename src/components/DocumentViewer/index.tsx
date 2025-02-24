'use client';

import { Upload } from 'lucide-react';

interface DocumentViewerProps {
  file: File | null;
  onFileChange: (file: File) => void;
}

export default function DocumentViewer({ file, onFileChange }: DocumentViewerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="p-6 h-screen">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Documento</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-lg h-[calc(100vh-8rem)]">
        {!file ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <label className="cursor-pointer text-blue-600 hover:text-blue-700 flex flex-col items-center">
              <span className="text-sm text-gray-500 mb-2">Cargar documento</span>
              <span className="text-sm font-medium">(PDF o JPG)</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="h-full">
            {file.type === 'application/pdf' ? (
              <iframe
                src={URL.createObjectURL(file)}
                className="w-full h-full rounded"
                title="PDF Viewer"
              />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt="Documento"
                className="max-w-full h-auto rounded"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}