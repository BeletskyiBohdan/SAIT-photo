// Export Manager
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { CONFIG } from './config.js';

export class ExportManager {
    async exportToZip(canvasWeb, canvasPrint, filename) {
        const zip = new JSZip();
        
        // Add web PNG
        const webBlob = await this.canvasToBlob(canvasWeb, 'image/png');
        zip.file(`${filename} - на сайт.png`, webBlob);
        
        // Add print JPG
        const printBlob = await this.canvasToBlob(canvasPrint, 'image/jpeg', CONFIG.EXPORT_JPG_QUALITY);
        zip.file(`${filename} - на друк.jpg`, printBlob);

        // Add PDF
        const pdfBlob = this.createPDF(canvasPrint);
        zip.file(`${filename} - на друк.pdf`, pdfBlob);
        
        // Generate and download ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        this.downloadBlob(zipBlob, `${filename}.zip`);
    }

    canvasToBlob(canvas, mimeType, quality = 1.0) {
        return new Promise(resolve => {
            canvas.toBlob(resolve, mimeType, quality);
        });
    }

    createPDF(canvas) {
        const pdf = new jsPDF({ 
            unit: 'mm', 
            format: [CONFIG.SIZES.PDF.width, CONFIG.SIZES.PDF.height] 
        });
        
        const dataUrl = canvas.toDataURL('image/jpeg', CONFIG.EXPORT_JPG_QUALITY);
        pdf.addImage(dataUrl, 'JPEG', 0, 0, CONFIG.SIZES.PDF.width, CONFIG.SIZES.PDF.height);
        
        return pdf.output('blob');
    }

    downloadBlob(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}
