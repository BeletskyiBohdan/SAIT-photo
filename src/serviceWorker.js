// Service Worker Registration
import { CONFIG } from './config.js';

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(CONFIG.SERVICE_WORKER_PATH)
            .then(() => console.log('Service Worker registered for caching'))
            .catch((err) => console.log('Service Worker registration failed:', err));
    }
}

export function logCrossOriginStatus() {
    if (!crossOriginIsolated) {
        console.info('Cross-origin isolation not enabled. Using single-threaded CPU mode on GitHub Pages.');
    }
}
