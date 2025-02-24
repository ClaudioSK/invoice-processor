export const invoiceTemplate = {
    fields: {
      // Información principal de la factura
      numero: {
        label: 'Factura N°',
        type: 'text',
        required: true,
        validation: /N° \d+/
      },
      fecha: {
        label: 'Fecha:',
        type: 'date',
        required: true
      },
  
      // Información del cliente
      cliente: {
        label: 'Nombre:',
        type: 'text',
        required: true
      },
      telefono: {
        label: 'Número:',
        type: 'text',
        validation: /\(\d+\) \d+-\d+/
      },
      direccion: {
        label: 'Dirección:',
        type: 'text'
      },
  
      // Tabla de servicios
      servicios: {
        type: 'table',
        headers: ['DESCRIPCIÓN', 'PRECIO', 'CANTIDAD', 'TOTAL'],
        validation: {
          precio: /\$[\d,]+\.\d{2}/,
          cantidad: /\d+/,
          total: /\$[\d,]+\.\d{2}/
        }
      },
  
      // Totales
      subtotal: {
        label: 'Sub-total',
        type: 'amount',
        validation: /\$[\d,]+\.\d{2}/
      },
      descuento: {
        label: 'Descuento',
        type: 'amount',
        validation: /\$[\d,]+\.\d{2}/
      },
      total: {
        label: 'TOTAL',
        type: 'amount',
        required: true,
        validation: /\$[\d,]+\.\d{2}/
      },
  
      // Información de pago
      banco: {
        label: 'Banco',
        type: 'text'
      },
      cuenta: {
        label: 'Número de la cuenta',
        type: 'text',
        validation: /\d{4} \d{4} \d{4}/
      }
    }
  };