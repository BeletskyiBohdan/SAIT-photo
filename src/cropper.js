// Cropper Management
import Cropper from 'cropperjs';

export class CropperManager {
    constructor(imageContainer, aspectRatio) {
        console.log(`✂️ [CropperManager] Створення cropper з співвідношенням ${aspectRatio.toFixed(3)}`);
        this.container = imageContainer;
        this.aspectRatio = aspectRatio;
        this.cropper = null;
    }

    initialize(blob) {
        console.log(`🔄 [CropperManager] Ініціалізація cropper, розмір blob: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(blob);
            imgElement.style.maxWidth = '100%';
            
            imgElement.onload = () => {
                console.log('🖼️ [CropperManager] Зображення завантажено, створення Cropper instance');
                this.cropper = new Cropper(imgElement, {
                    aspectRatio: this.aspectRatio,
                    viewMode: 1,
                    autoCropArea: 0.8,
                    zoomable: false,
                    scalable: false,
                    rotatable: false,
                });
                console.log('✅ [CropperManager] Cropper готовий до використання');
                resolve();
            };
            
            this.container.appendChild(imgElement);
        });
    }

    getCroppedCanvas() {
        console.log('✂️ [CropperManager] Отримання обрізаного canvas');
        const canvas = this.cropper ? this.cropper.getCroppedCanvas() : null;
        if (canvas) {
            console.log(`✅ [CropperManager] Canvas отримано: ${canvas.width}x${canvas.height}px`);
        } else {
            console.log('⚠️ [CropperManager] Cropper не ініціалізовано');
        }
        return canvas;
    }

    destroy() {
        if (this.cropper) {
            console.log('🗑️ [CropperManager] Знищення Cropper instance');
            this.cropper.destroy();
            this.cropper = null;
        }
    }
}
