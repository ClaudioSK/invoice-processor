# Procesador de Facturas con OCR

Aplicación web construida con Next.js para procesar facturas utilizando tecnología OCR (Reconocimiento Óptico de Caracteres). Esta aplicación permite a los usuarios cargar imágenes de facturas y extraer automáticamente información relevante como números de factura, fechas, detalles del cliente e información de servicios.

## Características

- Carga y vista previa de imágenes
- Extracción de texto mediante Tesseract.js
- Procesamiento de datos de factura en tiempo real
- Interfaz dividida con visor de documentos
- Capacidad de edición de formularios
- Soporte para múltiples facturas
- Interfaz en español

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- Node.js (versión 18 o superior)
- npm (Gestor de Paquetes de Node)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/invoice-processor.git
cd invoice-processor
2. Instala las dependencias:
```bash
npm install
 ```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
 ```

4. Abre http://localhost:3000 en tu navegador para ver la aplicación.
## Uso
1. Haz clic en "Cargar Facturas" para subir una o más imágenes de facturas
2. La aplicación procesará cada imagen usando OCR
3. Revisa y edita la información extraída en el formulario
4. Navega entre múltiples facturas usando los botones de navegación
5. Guarda o limpia los datos de la factura según sea necesario
## Tecnologías Utilizadas
- Next.js 14
- TypeScript
- Tesseract.js para OCR
- Tailwind CSS para estilos
## Contribuir
¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
