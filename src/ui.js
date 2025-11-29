// UI Controller
import { CONFIG } from './config.js';

export class UIController {
    constructor() {
        console.log('🎨 [UIController] Ініціалізація UI контролера');
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
        console.log('✅ [UIController] Всі елементи UI знайдено та ініціалізовано');

        // Стан симульованого прогресбару
        this.simProgress = {
            timerId: null,
            percent: 0,
            messageIndex: 0,
        };
    }

    showStep(step) {
        console.log(`📄 [UIController] Перехід на крок: ${step}`);
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
        console.log('🔄 [UIController] Скидання прогресу');
        this.elements.progressBar.style.width = '0%';
        this.elements.progressPercent.textContent = '0%';
        this.elements.loadingStage.textContent = 'Підготовка...';
    }

    clearContainers() {
        console.log('🧹 [UIController] Очищення контейнерів зображень');
        this.elements.imageContainer.innerHTML = '';
        this.elements.imageContainer2.innerHTML = '';
    }

    resetInputs() {
        console.log('🔄 [UIController] Скидання полів вводу');
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

    // Симульований прогресбар на 5 хвилин з кроком 1%/3с та стопом на 99%
    startSimulatedProgress() {
        console.log('⏳ [UIController] Старт симульованого прогресу');
        // Показати екран прогресу (крок 1_5 має бути активований ззовні)
        this.simProgress.percent = 0;
        this.simProgress.messageIndex = 0;
        this._renderProgress(this.simProgress.percent, CONFIG.PROGRESS_MESSAGES[0]);

        if (this.simProgress.timerId) {
            clearInterval(this.simProgress.timerId);
        }

        this.simProgress.timerId = setInterval(() => {
            if (this.simProgress.percent >= CONFIG.PROGRESS.MAX_SIM_PERCENT) {
                // Зупиняємося на 99% і чекаємо завершення реального процесу
                return;
            }
            this.simProgress.percent += 1;
            this.simProgress.messageIndex = (this.simProgress.messageIndex + 1) % CONFIG.PROGRESS_MESSAGES.length;
            const msg = CONFIG.PROGRESS_MESSAGES[this.simProgress.messageIndex];
            this._renderProgress(this.simProgress.percent, msg);
        }, CONFIG.PROGRESS.TICK_MS);
    }

    // Миттєво сховати прогресбар (коли процеси завершені раніше)
    finishSimulatedProgress() {
        console.log('✅ [UIController] Завершення симульованого прогресу');
        if (this.simProgress.timerId) clearInterval(this.simProgress.timerId);
        this.simProgress.timerId = null;
        this.resetProgress();
    }

    // Зупинити і скинути без зміни кроку (для обробки помилки)
    stopSimulatedProgress() {
        console.log('🛑 [UIController] Зупинка симульованого прогресу');
        if (this.simProgress.timerId) clearInterval(this.simProgress.timerId);
        this.simProgress.timerId = null;
        this.resetProgress();
    }

    _renderProgress(percent, message) {
        this.elements.progressBar.style.width = percent + '%';
        this.elements.progressPercent.textContent = percent + '%';
        this.elements.loadingStage.textContent = message;
        console.log(`📊 [UIController] Прогрес: ${percent}% — ${message}`);
    }
}
