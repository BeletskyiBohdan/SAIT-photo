// Main Entry Point
import { App } from './app.js';
import 'cropperjs/dist/cropper.min.css';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.initialize();
});
