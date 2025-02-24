'use client';

import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

interface InvoiceFormProps {
  data: {
    numeroFactura: string;
    fecha: string;
    cliente: string;
    telefono: string;
    direccion: string;
    servicios: Array<{
      descripcion: string;
      precio: string;
      cantidad: string;
      total: string;
    }>;
    subtotal: string;
    descuento: string;
    total: string;
    banco: string;
    numeroCuenta: string;
  };
  setData: (data: any) => void;
  isProcessing: boolean;
  error: string | null;
}

export default function InvoiceForm({ data, setData, isProcessing, error }: InvoiceFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Agregar función para limpiar factura
  const handleClear = () => {
    const emptyData = {
      numeroFactura: '',
      fecha: '',
      cliente: '',
      telefono: '',
      direccion: '',
      servicios: [],
      subtotal: '0',
      descuento: '0',
      total: '0',
      banco: '',
      numeroCuenta: ''
    };
    
    if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
      setData(emptyData);
    }
  };
  
  // Agregar función para nuevo servicio
  const handleAddService = () => {
    const newService = {
      descripcion: '',
      precio: '0',
      cantidad: '1',
      total: '0'
    };
    setData({
      ...data,
      servicios: [...data.servicios, newService]
    });
  };
  
  // Agregar función para eliminar servicio
  const handleDeleteService = (index: number) => {
    const newServices = data.servicios.filter((_, i) => i !== index);
    setData({
      ...data,
      servicios: newServices
    });
  };
  
  // Modificar handleServiceChange para validar números
  const handleServiceChange = (index: number, field: string, value: string) => {
    const newServices = [...data.servicios];
    if (field === 'precio' || field === 'cantidad') {
      // Validar que solo sean números
      if (!/^\d*\.?\d*$/.test(value)) return;
      
      // Calcular el total
      const precio = field === 'precio' ? parseFloat(value) || 0 : parseFloat(newServices[index].precio) || 0;
      const cantidad = field === 'cantidad' ? parseFloat(value) || 0 : parseFloat(newServices[index].cantidad) || 0;
      newServices[index] = {
        ...newServices[index],
        [field]: value,
        total: (precio * cantidad).toFixed(2)
      };
    } else {
      newServices[index] = { ...newServices[index], [field]: value };
    }
    setData({ ...data, servicios: newServices });
  };
  
  const handleSave = () => {
    if (isEditing) {
      setIsEditing(false);
    }
    // Here you can add logic to save the data
    console.log('Saving invoice data:', data);
    // You could add API calls or localStorage saving here
  };
  
  return (
    <div className="h-screen overflow-y-auto bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Datos Factura</h1>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Limpiar
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {isEditing ? 'Guardar Cambios' : 'Editar Datos'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isProcessing ? (
          <div className="bg-blue-50 p-8 rounded-lg mb-4">
            <div className="text-center space-y-4">
              <Spinner />
              <p className="text-blue-600 font-medium">
                Procesando documento...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Número de Factura y Fecha section stays the same */}
            {/* Add back Cliente section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Información del Cliente
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cliente
                  </label>
                  <Input
                    value={data.cliente}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('cliente', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Teléfono
                  </label>
                  <Input
                    value={data.telefono}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Dirección
                  </label>
                  <Input
                    value={data.direccion}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Add back Servicios section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Servicios
                </h3>
                {isEditing && (
                  <button
                    onClick={handleAddService}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Agregar Servicio
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-2 text-sm font-semibold text-gray-900">
                <div>Descripción</div>
                <div>Precio</div>
                <div>Cantidad</div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  {isEditing && <span className="w-10"></span>}
                </div>
              </div>
              
              {data.servicios.map((servicio, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center">
                  <Input
                    value={servicio.descripcion}
                    readOnly={!isEditing}
                    onChange={(e) => handleServiceChange(index, 'descripcion', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                  <Input
                    type="text"
                    value={servicio.precio}
                    readOnly={!isEditing}
                    onChange={(e) => handleServiceChange(index, 'precio', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                  <Input
                    type="text"
                    value={servicio.cantidad}
                    readOnly={!isEditing}
                    onChange={(e) => handleServiceChange(index, 'cantidad', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      value={servicio.total}
                      readOnly
                      className="bg-gray-50 text-gray-900"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteService(index)}
                        className="p-2 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                        title="Eliminar servicio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add back Totals section */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-900">
                  <span>Sub-total</span>
                  <span>${data.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span>Descuento (15%)</span>
                  <span>${data.descuento}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>TOTAL</span>
                  <span>${data.total}</span>
                </div>
              </div>
            </div>

            {/* Add back Payment Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Información de Pago
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Banco
                  </label>
                  <Input
                    value={data.banco}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('banco', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Número de Cuenta
                  </label>
                  <Input
                    value={data.numeroCuenta}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('numeroCuenta', e.target.value)}
                    className={`bg-gray-50 text-gray-900 ${isEditing ? 'hover:bg-white focus:bg-white' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Add back Save buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Guardar Factura
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}