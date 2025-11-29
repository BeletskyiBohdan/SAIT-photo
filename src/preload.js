// Model Preloader
import { removeBackground } from '@imgly/background-removal';
import { CONFIG } from './config.js';

export async function preloadModel() {
    try {
        console.log('⏳ [Preload] Попереднє завантаження моделі видалення фону...');
        const startTime = performance.now();
        await removeBackground(new Blob([new Uint8Array(1)], { type: 'image/png' }), {
            device: CONFIG.DEVICE_MODE
        }).catch(() => {});
        const duration = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ [Preload] Модель завантажено успішно за ${duration}с`);
    } catch (e) {
        console.log('⚠️ [Preload] Попереднє завантаження моделі пропущено');
    }
}
