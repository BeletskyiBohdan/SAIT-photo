// Image Processing Utilities
import { removeBackground } from '@imgly/background-removal';
import { CONFIG } from './config.js';

export class ImageProcessor {
    constructor(progressCallback) {
        this.progressCallback = progressCallback;
    }

    async downsizeImage(file, maxHeight = CONFIG.SIZES.MAX_HEIGHT) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                let { width, height } = img;
                
                if (height > maxHeight) {
                    const scale = maxHeight / height;
                    width = Math.round(width * scale);
                    height = maxHeight;
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        resolve(blob || file);
                    }, 'image/jpeg', CONFIG.DOWNSIZE_QUALITY);
                } else {
                    resolve(file);
                }
            };
            
            img.onerror = () => resolve(file);
            img.src = URL.createObjectURL(file);
        });
    }

    async removeBackground(file) {
        const downsizedFile = await this.downsizeImage(file);
        console.log(`Original: ${file.size} bytes, Downsized: ${downsizedFile.size} bytes`);
        
        this.progressCallback('fetch:model', 0, 100);
        
        return await removeBackground(downsizedFile, {
            device: CONFIG.DEVICE_MODE,
            progress: this.progressCallback
        });
    }

    createCanvasWithBackground(sourceCanvas, width, height, bgColor) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(sourceCanvas, 0, 0, width, height);
        
        return canvas;
    }
}
