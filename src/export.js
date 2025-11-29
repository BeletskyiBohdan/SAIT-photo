// Export Manager
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { CONFIG } from './config.js';

export class ExportManager {
    async exportToZip(canvasWeb, canvasPrint, filename) {
        console.log(`📦 [ExportManager] Створення ZIP архіву: ${filename}.zip`);
        const zip = new JSZip();
        
        // Add web PNG
        console.log('🖼️ [ExportManager] Конвертація веб-версії в PNG');
        const webBlob = await this.canvasToBlob(canvasWeb, 'image/png');
        console.log(`✅ [ExportManager] PNG створено: ${(webBlob.size / 1024).toFixed(2)} KB`);
        zip.file(`${filename} - на сайт.png`, webBlob);
        
        // Add print JPG
        console.log('🖼️ [ExportManager] Конвертація версії для друку в JPG');
        const printBlob = await this.canvasToBlob(canvasPrint, 'image/jpeg', CONFIG.EXPORT_JPG_QUALITY);
        console.log(`✅ [ExportManager] JPG створено: ${(printBlob.size / 1024).toFixed(2)} KB`);
        zip.file(`${filename} - на друк.jpg`, printBlob);

        // Add PDF
        console.log('📄 [ExportManager] Створення PDF документу');
        const pdfBlob = this.createPDF(canvasPrint);
        console.log(`✅ [ExportManager] PDF створено: ${(pdfBlob.size / 1024).toFixed(2)} KB`);
        zip.file(`${filename} - на друк.pdf`, pdfBlob);
        
        // Generate and download ZIP
        console.log('🗜️ [ExportManager] Генерація ZIP архіву');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        console.log(`✅ [ExportManager] ZIP згенеровано: ${(zipBlob.size / 1024).toFixed(2)} KB`);
        this.downloadBlob(zipBlob, `${filename}.zip`);
    }

    canvasToBlob(canvas, mimeType, quality = 1.0) {
        return new Promise(resolve => {
            canvas.toBlob(resolve, mimeType, quality);
        });
    }

    createPDF(canvas) {
        console.log(`📄 [ExportManager] Створення PDF формату A6 (${CONFIG.SIZES.PDF.width}x${CONFIG.SIZES.PDF.height}mm)`);
        const pdf = new jsPDF({ 
            unit: 'mm', 
            format: [CONFIG.SIZES.PDF.width, CONFIG.SIZES.PDF.height] 
        });
        
        const dataUrl = canvas.toDataURL('image/jpeg', CONFIG.EXPORT_JPG_QUALITY);
        pdf.addImage(dataUrl, 'JPEG', 0, 0, CONFIG.SIZES.PDF.width, CONFIG.SIZES.PDF.height);
        console.log('✅ [ExportManager] Зображення додано до PDF');
        
        return pdf.output('blob');
    }

    downloadBlob(blob, filename) {
        console.log(`⬇️ [ExportManager] Завантаження файлу: ${filename}`);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        console.log('✅ [ExportManager] Файл завантажено');
    }
}
