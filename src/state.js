// Application State Management
export class AppState {
    constructor() {
        console.log('📦 [AppState] Ініціалізація стану додатку');
        this.currentStep = 1;
        this.uploadedFile = null;
        this.processedBlob = null;
        this.cropperWeb = null;
        this.cropperPrint = null;
        this.croppedWebCanvas = null;
        this.croppedPrintCanvas = null;
        this.userName = '';
        this.userPosition = 0;
    }

    reset() {
        console.log('🔄 [AppState] Скидання стану додатку');
        this.currentStep = 1;
        this.uploadedFile = null;
        this.processedBlob = null;
        this.cropperWeb?.destroy();
        this.cropperPrint?.destroy();
        this.cropperWeb = null;
        this.cropperPrint = null;
        this.croppedWebCanvas = null;
        this.croppedPrintCanvas = null;
        this.userName = '';
        this.userPosition = 0;
        console.log('✅ [AppState] Стан скинуто');
    }
}
