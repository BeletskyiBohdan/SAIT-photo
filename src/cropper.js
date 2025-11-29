// Cropper Management
import Cropper from 'cropperjs';

export class CropperManager {
    constructor(imageContainer, aspectRatio) {
        this.container = imageContainer;
        this.aspectRatio = aspectRatio;
        this.cropper = null;
    }

    initialize(blob) {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(blob);
            imgElement.style.maxWidth = '100%';
            
            imgElement.onload = () => {
                this.cropper = new Cropper(imgElement, {
                    aspectRatio: this.aspectRatio,
                    viewMode: 1,
                    autoCropArea: 0.8,
                    zoomable: false,
                    scalable: false,
                    rotatable: false,
                });
                resolve();
            };
            
            this.container.appendChild(imgElement);
        });
    }

    getCroppedCanvas() {
        return this.cropper ? this.cropper.getCroppedCanvas() : null;
    }

    destroy() {
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    }
}
