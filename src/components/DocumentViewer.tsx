'use client';

import React from 'react';

interface DocumentViewerProps {
  file: File | null;
  onFileChange: (file: File) => void;
}

export default function DocumentViewer({ file, onFileChange }: DocumentViewerProps) {
  return (
    <div className="h-screen flex flex-col bg-white p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Cargar Factura</h1>
      <div className="flex-1 flex items-center justify-center">
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange(file);
              }} 
              accept="image/*" 
            />
          </label>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}