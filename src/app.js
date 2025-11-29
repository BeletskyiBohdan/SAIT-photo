// Main Application Controller
import { AppState } from './state.js';
import { UIController } from './ui.js';
import { ImageProcessor } from './imageProcessor.js';
import { CropperManager } from './cropper.js';
import { ExportManager } from './export.js';
import { CONFIG } from './config.js';
import { preloadModel } from './preload.js';

export class App {
    constructor() {
        console.log('🚀 [App] Ініціалізація додатку');
        this.state = new AppState();
        this.ui = new UIController();
        this.imageProcessor = new ImageProcessor((key, current, total) => {
            this.ui.updateProgress(key, current, total);
        });
        this.exportManager = new ExportManager();
        this.cropperWeb = null;
        this.cropperPrint = null;
        console.log('✅ [App] Всі модулі створено');
    }

    async initialize() {
        console.log('⚙️ [App] Початок ініціалізації додатку');
        this.attachEventListeners();
        console.log('✅ [App] Додаток готовий до роботи');
    }

    attachEventListeners() {
        console.log('🔗 [App] Прив\'язка обробників подій');
        this.ui.elements.uploadBtn.addEventListener('click', () => {
            console.log('👆 [App] Клік на кнопку завантаження');
            this.ui.elements.upload.click();
        });

        this.ui.elements.upload.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        this.ui.elements.continueBtn.addEventListener('click', () => {
            this.handleContinueToWebCrop();
        });

        this.ui.elements.cropWebBtn.addEventListener('click', () => {
            this.handleWebCrop();
        });

        this.ui.elements.toPrintBtn.addEventListener('click', () => {
            this.handleContinueToPrintCrop();
        });

        this.ui.elements.cropPrintBtn.addEventListener('click', () => {
            this.handlePrintCrop();
        });

        this.ui.elements.saveBtn.addEventListener('click', () => {
            this.handleSave();
        });

        this.ui.elements.restartBtn.addEventListener('click', () => {
            this.handleRestart();
        });
    }

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            console.log('⚠️ [App] Файл не обрано');
            return;
        }
        
        console.log(`📁 [App] Завантажено файл: ${file.name}, розмір: ${(file.size / 1024 / 1024).toFixed(2)} MB, тип: ${file.type}`);
        this.state.uploadedFile = file;
        
        try {
            console.log('🔄 [App] Початок обробки фото');
            this.ui.showStep('1_5');
            
            // Завантажуємо модель перед обробкою
            await preloadModel();
            
            this.state.processedBlob = await this.imageProcessor.removeBackground(file);
            console.log('✅ [App] Фон успішно видалено');
            this.ui.showStep(2);
        } catch (error) {
            console.error('❌ [App] Помилка обробки:', error);
            alert('Сталася помилка під час обробки зображення.');
            this.ui.showStep(1);
        }
    }

    async handleContinueToWebCrop() {
        const name = this.ui.getUserName();
        if (!name) {
            console.log('⚠️ [App] Ім\'я не введено');
            alert('Будь ласка, введіть ім\'я.');
            return;
        }
        
        this.state.userName = name;
        this.state.userPosition = this.ui.getUserPosition();
        console.log(`👤 [App] Користувач: ${name}, Посада: ${CONFIG.POSITIONS[this.state.userPosition]}`);
        
        console.log('✂️ [App] Ініціалізація cropper для веб-версії');
        this.cropperWeb = new CropperManager(
            this.ui.elements.imageContainer,
            CONFIG.SIZES.WEB.width / CONFIG.SIZES.WEB.height
        );
        
        await this.cropperWeb.initialize(this.state.processedBlob);
        console.log('✅ [App] Cropper для веб готовий');
        this.ui.showStep(3);
    }

    handleWebCrop() {
        if (!this.cropperWeb) {
            console.log('⚠️ [App] Cropper не ініціалізовано');
            return;
        }
        
        console.log('✂️ [App] Застосування обрізання для веб-версії');
        const croppedCanvas = this.cropperWeb.getCroppedCanvas();
        const bgColor = CONFIG.BG_COLORS[this.state.userPosition];
        console.log(`🎨 [App] Колір фону: ${bgColor}`);
        
        const resultCanvas = this.imageProcessor.createCanvasWithBackground(
            croppedCanvas,
            CONFIG.SIZES.WEB.width,
            CONFIG.SIZES.WEB.height,
            bgColor
        );
        
        console.log(`📐 [App] Створення веб-версії: ${CONFIG.SIZES.WEB.width}x${CONFIG.SIZES.WEB.height}px`);
        this.ui.ctxWeb.canvas.width = CONFIG.SIZES.WEB.width;
        this.ui.ctxWeb.canvas.height = CONFIG.SIZES.WEB.height;
        this.ui.ctxWeb.drawImage(resultCanvas, 0, 0);
        
        this.cropperWeb.destroy();
        console.log('✅ [App] Веб-версія готова');
        this.ui.showStep('3_5');
    }

    async handleContinueToPrintCrop() {
        console.log('✂️ [App] Ініціалізація cropper для друку');
        this.cropperPrint = new CropperManager(
            this.ui.elements.imageContainer2,
            CONFIG.SIZES.PRINT.width / CONFIG.SIZES.PRINT.height
        );
        
        await this.cropperPrint.initialize(this.state.processedBlob);
        console.log('✅ [App] Cropper для друку готовий');
        this.ui.showStep(4);
    }

    handlePrintCrop() {
        if (!this.cropperPrint) {
            console.log('⚠️ [App] Cropper не ініціалізовано');
            return;
        }
        
        console.log('✂️ [App] Застосування обрізання для друку');
        const croppedCanvas = this.cropperPrint.getCroppedCanvas();
        const bgColor = CONFIG.BG_COLORS[this.state.userPosition];
        console.log(`🎨 [App] Колір фону: ${bgColor}`);
        
        const resultCanvas = this.imageProcessor.createCanvasWithBackground(
            croppedCanvas,
            CONFIG.SIZES.PRINT.width,
            CONFIG.SIZES.PRINT.height,
            bgColor
        );
        
        console.log(`📐 [App] Створення версії для друку: ${CONFIG.SIZES.PRINT.width}x${CONFIG.SIZES.PRINT.height}px`);
        this.ui.ctxPrint.canvas.width = CONFIG.SIZES.PRINT.width;
        this.ui.ctxPrint.canvas.height = CONFIG.SIZES.PRINT.height;
        this.ui.ctxPrint.drawImage(resultCanvas, 0, 0);
        
        this.cropperPrint.destroy();
        console.log('✅ [App] Версія для друку готова');
        this.ui.showStep('4_5');
    }

    async handleSave() {
        const shortPos = CONFIG.SHORT_POSITIONS[this.state.userPosition];
        const filename = `${shortPos} ${this.state.userName}`;
        console.log(`💾 [App] Збереження файлів: ${filename}`);
        
        await this.exportManager.exportToZip(
            this.ui.elements.canvasWeb,
            this.ui.elements.canvasPrint,
            filename
        );
        
        console.log('✅ [App] Файли успішно збережено');
        this.ui.showStep(5);
    }

    handleRestart() {
        console.log('🔄 [App] Перезапуск додатку');
        this.state.reset();
        this.ui.resetInputs();
        this.ui.clearContainers();
        this.ui.resetProgress();
        this.ui.showStep(1);
        console.log('✅ [App] Додаток скинуто до початкового стану');
    }
}
