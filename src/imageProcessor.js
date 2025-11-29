// Image Processing Utilities
import { removeBackground } from '@imgly/background-removal';
import { CONFIG } from './config.js';

export class ImageProcessor {
    constructor(progressCallback) {
        this.progressCallback = progressCallback;
    }

    async downsizeImage(file, maxHeight = CONFIG.SIZES.MAX_HEIGHT) {
        console.log(`📏 [ImageProcessor] Перевірка розміру зображення (макс висота: ${maxHeight}px)`);
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                let { width, height } = img;
                console.log(`📐 [ImageProcessor] Оригінальний розмір: ${width}x${height}px`);
                
                if (height > maxHeight) {
                    const scale = maxHeight / height;
                    width = Math.round(width * scale);
                    height = maxHeight;
                    console.log(`🔽 [ImageProcessor] Зменшення до: ${width}x${height}px (коефіцієнт: ${scale.toFixed(3)})`);
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        console.log(`✅ [ImageProcessor] Розмір після стиснення: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
                        resolve(blob || file);
                    }, 'image/jpeg', CONFIG.DOWNSIZE_QUALITY);
                } else {
                    console.log('✅ [ImageProcessor] Зображення не потребує зменшення');
                    resolve(file);
                }
            };
            
            img.onerror = () => {
                console.error('❌ [ImageProcessor] Помилка завантаження зображення');
                resolve(file);
            };
            img.src = URL.createObjectURL(file);
        });
    }

    async removeBackground(file) {
        console.log('🔄 [ImageProcessor] Початок видалення фону');
        const downsizedFile = await this.downsizeImage(file);
        console.log(`📊 [ImageProcessor] Оригінал: ${(file.size / 1024 / 1024).toFixed(2)} MB, Після стиснення: ${(downsizedFile.size / 1024 / 1024).toFixed(2)} MB`);
        
        this.progressCallback('fetch:model', 0, 100);
        console.log(`⚙️ [ImageProcessor] Режим обробки: ${CONFIG.DEVICE_MODE.toUpperCase()}`);
        
        const result = await removeBackground(downsizedFile, {
            device: CONFIG.DEVICE_MODE,
            progress: this.progressCallback
        });
        console.log(`✅ [ImageProcessor] Фон видалено, розмір результату: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
        return result;
    }

    createCanvasWithBackground(sourceCanvas, width, height, bgColor) {
        console.log(`🎨 [ImageProcessor] Створення canvas з фоном: ${width}x${height}px, колір: ${bgColor}`);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(sourceCanvas, 0, 0, width, height);
        
        console.log('✅ [ImageProcessor] Canvas з фоном створено');
        return canvas;
    }
}
