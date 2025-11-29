// Main Application Controller
import { AppState } from './state.js';
import { UIController } from './ui.js';
import { ImageProcessor } from './imageProcessor.js';
import { CropperManager } from './cropper.js';
import { ExportManager } from './export.js';
import { CONFIG } from './config.js';
import { registerServiceWorker, logCrossOriginStatus } from './serviceWorker.js';
import { preloadModel } from './preload.js';

export class App {
    constructor() {
        this.state = new AppState();
        this.ui = new UIController();
        this.imageProcessor = new ImageProcessor((key, current, total) => {
            this.ui.updateProgress(key, current, total);
        });
        this.exportManager = new ExportManager();
        this.cropperWeb = null;
        this.cropperPrint = null;
    }

    async initialize() {
        registerServiceWorker();
        logCrossOriginStatus();
        await preloadModel();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.ui.elements.uploadBtn.addEventListener('click', () => {
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
        if (!file) return;
        
        this.state.uploadedFile = file;
        
        try {
            this.ui.showStep('1_5');
            this.state.processedBlob = await this.imageProcessor.removeBackground(file);
            this.ui.showStep(2);
        } catch (error) {
            console.error('Помилка обробки:', error);
            alert('Сталася помилка під час обробки зображення.');
            this.ui.showStep(1);
        }
    }

    async handleContinueToWebCrop() {
        const name = this.ui.getUserName();
        if (!name) {
            alert('Будь ласка, введіть ім\'я.');
            return;
        }
        
        this.state.userName = name;
        this.state.userPosition = this.ui.getUserPosition();
        
        this.cropperWeb = new CropperManager(
            this.ui.elements.imageContainer,
            CONFIG.SIZES.WEB.width / CONFIG.SIZES.WEB.height
        );
        
        await this.cropperWeb.initialize(this.state.processedBlob);
        this.ui.showStep(3);
    }

    handleWebCrop() {
        if (!this.cropperWeb) return;
        
        const croppedCanvas = this.cropperWeb.getCroppedCanvas();
        const bgColor = CONFIG.BG_COLORS[this.state.userPosition];
        
        const resultCanvas = this.imageProcessor.createCanvasWithBackground(
            croppedCanvas,
            CONFIG.SIZES.WEB.width,
            CONFIG.SIZES.WEB.height,
            bgColor
        );
        
        this.ui.ctxWeb.canvas.width = CONFIG.SIZES.WEB.width;
        this.ui.ctxWeb.canvas.height = CONFIG.SIZES.WEB.height;
        this.ui.ctxWeb.drawImage(resultCanvas, 0, 0);
        
        this.cropperWeb.destroy();
        this.ui.showStep('3_5');
    }

    async handleContinueToPrintCrop() {
        this.cropperPrint = new CropperManager(
            this.ui.elements.imageContainer2,
            CONFIG.SIZES.PRINT.width / CONFIG.SIZES.PRINT.height
        );
        
        await this.cropperPrint.initialize(this.state.processedBlob);
        this.ui.showStep(4);
    }

    handlePrintCrop() {
        if (!this.cropperPrint) return;
        
        const croppedCanvas = this.cropperPrint.getCroppedCanvas();
        const bgColor = CONFIG.BG_COLORS[this.state.userPosition];
        
        const resultCanvas = this.imageProcessor.createCanvasWithBackground(
            croppedCanvas,
            CONFIG.SIZES.PRINT.width,
            CONFIG.SIZES.PRINT.height,
            bgColor
        );
        
        this.ui.ctxPrint.canvas.width = CONFIG.SIZES.PRINT.width;
        this.ui.ctxPrint.canvas.height = CONFIG.SIZES.PRINT.height;
        this.ui.ctxPrint.drawImage(resultCanvas, 0, 0);
        
        this.cropperPrint.destroy();
        this.ui.showStep('4_5');
    }

    async handleSave() {
        const shortPos = CONFIG.SHORT_POSITIONS[this.state.userPosition];
        const filename = `${shortPos} ${this.state.userName}`;
        
        await this.exportManager.exportToZip(
            this.ui.elements.canvasWeb,
            this.ui.elements.canvasPrint,
            filename
        );
        
        this.ui.showStep(5);
    }

    handleRestart() {
        this.state.reset();
        this.ui.resetInputs();
        this.ui.clearContainers();
        this.ui.resetProgress();
        this.ui.showStep(1);
    }
}
