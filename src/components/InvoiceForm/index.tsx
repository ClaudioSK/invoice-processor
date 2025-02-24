'use client';

import { AlertCircle, Plus, Trash } from 'lucide-react';

interface Service {
  descripcion: string;
  precio: string;
  cantidad: string;
  total: string;
}

interface InvoiceData {
  numeroFactura: string;
  fecha: string;
  cliente: string;
  telefono: string;
  direccion: string;
  servicios: Service[];
  subtotal: string;
  descuento: string;
  total: string;
  banco: string;
  numeroCuenta: string;
}

interface InvoiceFormProps {
  data: InvoiceData;
  setData: (data: InvoiceData) => void;
  isProcessing: boolean;
  error: string | null;
}

export default function InvoiceForm({ data, setData, isProcessing, error }: InvoiceFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const newServices = [...data.servicios];
    newServices[index] = { ...newServices[index], [field]: value };

    // Calcular total si se cambia precio o cantidad
    if (field === 'precio' || field === 'cantidad') {
      const precio = parseFloat(newServices[index].precio || '0');
      const cantidad = parseFloat(newServices[index].cantidad || '0');
      if (!isNaN(precio) && !isNaN(cantidad)) {
        newServices[index].total = (precio * cantidad).toFixed(2);
      }
    }

    setData({ ...data, servicios: newServices });
  };

  const addService = () => {
    setData({
      ...data,
      servicios: [...data.servicios, { descripcion: '', precio: '', cantidad: '', total: '' }]
    });
  };

  const removeService = (index: number) => {
    setData({
      ...data,
      servicios: data.servicios.filter((_, i) => i !== index)
    });
  };

  const calculateTotals = () => {
    const subtotal = data.servicios.reduce((sum, service) => {
      return sum + parseFloat(service.total || '0');
    }, 0);

    const descuentoPorcentaje = 15;
    const descuento = subtotal * (descuentoPorcentaje / 100);
    const total = subtotal - descuento;

    setData({
      ...data,
      subtotal: subtotal.toFixed(2),
      descuento: descuento.toFixed(2),
      total: total.toFixed(2)
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Datos Extraídos</h2>
      
      {isProcessing ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Procesando documento...</span>
        </div>
      ) : (
        <form className="space-y-6">
          {error && (
            <div className="flex items-center p-4 text-red-500 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Datos principales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Número de Factura
              </label>
              <input
                type="text"
                name="numeroFactura"
                value={data.numeroFactura}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={data.fecha}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Información del cliente */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Cliente
                </label>
                <input
                  type="text"
                  name="cliente"
                  value={data.cliente}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={data.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={data.direccion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-800">Servicios</h3>
              <button
                type="button"
                onClick={addService}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar servicio
              </button>
            </div>
            <div className="space-y-2">
              {data.servicios.map((servicio, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={servicio.descripcion}
                    onChange={(e) => handleServiceChange(index, 'descripcion', e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={servicio.precio}
                    onChange={(e) => handleServiceChange(index, 'precio', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={servicio.cantidad}
                    onChange={(e) => handleServiceChange(index, 'cantidad', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Total"
                    value={servicio.total}
                    readOnly
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sub-total</span>
              <span className="font-medium">${data.subtotal || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Descuento (15%)</span>
              <span className="font-medium">${data.descuento || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-800">TOTAL</span>
              <span className="font-bold text-gray-800">${data.total || '0.00'}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={calculateTotals}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              Calcular Totales
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}