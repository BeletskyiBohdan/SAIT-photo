// UI Controller
import { CONFIG } from './config.js';

export class UIController {
    constructor() {
        this.elements = {
            steps: document.querySelectorAll('.step'),
            upload: document.getElementById('upload'),
            uploadBtn: document.getElementById('uploadBtn'),
            nameInput: document.getElementById('name'),
            positionSelect: document.getElementById('position'),
            continueBtn: document.getElementById('continueBtn'),
            cropWebBtn: document.getElementById('cropWebBtn'),
            toPrintBtn: document.getElementById('toPrintBtn'),
            cropPrintBtn: document.getElementById('cropPrintBtn'),
            saveBtn: document.getElementById('saveBtn'),
            restartBtn: document.getElementById('restartBtn'),
            imageContainer: document.getElementById('imageContainer'),
            imageContainer2: document.getElementById('imageContainer2'),
            canvasWeb: document.getElementById('canvasWeb'),
            canvasPrint: document.getElementById('canvasPrint'),
            progressBar: document.getElementById('progressBar'),
            progressPercent: document.getElementById('progressPercent'),
            loadingStage: document.getElementById('loadingStage')
        };
        
        this.ctxWeb = this.elements.canvasWeb.getContext('2d');
        this.ctxPrint = this.elements.canvasPrint.getContext('2d');
    }

    showStep(step) {
        this.elements.steps.forEach(s => s.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');
    }

    updateProgress(key, current, total) {
        const percent = Math.round((current / total) * 100);
        this.elements.progressBar.style.width = percent + '%';
        this.elements.progressPercent.textContent = percent + '%';
        
        const stageName = CONFIG.STAGE_NAMES[key] || `${key}: ${current}/${total}`;
        this.elements.loadingStage.textContent = stageName;
        
        console.log(`${key}: ${current}/${total} (${percent}%)`);
    }

    resetProgress() {
        this.elements.progressBar.style.width = '0%';
        this.elements.progressPercent.textContent = '0%';
        this.elements.loadingStage.textContent = 'Підготовка...';
    }

    clearContainers() {
        this.elements.imageContainer.innerHTML = '';
        this.elements.imageContainer2.innerHTML = '';
    }

    resetInputs() {
        this.elements.upload.value = '';
        this.elements.nameInput.value = '';
        this.elements.positionSelect.selectedIndex = 0;
    }

    getUserName() {
        return this.elements.nameInput.value.trim();
    }

    getUserPosition() {
        return this.elements.positionSelect.selectedIndex;
    }
}
