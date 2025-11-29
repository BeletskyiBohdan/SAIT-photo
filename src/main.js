// Main Entry Point
import { App } from './app.js';
import 'cropperjs/dist/cropper.min.css';

console.log('🌟 [Main] Завантаження додатку...');

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 [Main] DOM завантажено, запуск додатку');
    const app = new App();
    await app.initialize();
});
