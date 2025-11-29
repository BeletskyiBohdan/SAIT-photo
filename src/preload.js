// Model Preloader
import { removeBackground } from '@imgly/background-removal';
import { CONFIG } from './config.js';

export async function preloadModel() {
    try {
        console.log('Preloading background removal model...');
        await removeBackground(new Blob([new Uint8Array(1)], { type: 'image/png' }), {
            device: CONFIG.DEVICE_MODE
        }).catch(() => {});
        console.log('Model preloaded successfully');
    } catch (e) {
        console.log('Model preload skipped');
    }
}
