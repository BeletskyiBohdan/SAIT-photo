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
            at99Timers: [], // таймери для повідомлень на 99%
            checkCompletionCallback: null // колбек для перевірки завершення процесу
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

    // Симульований прогресбар: відсоток +1% кожні 3с, повідомлення кожні 5%, стоп на 99%
    // Приймає опціональний колбек для перевірки завершення процесу кожні 8%
    startSimulatedProgress(checkCompletionCallback = null) {
        console.log('⏳ [UIController] Старт симульованого прогресу');
        this.simProgress.percent = 0;
        this.simProgress.messageIndex = 0;
        this.simProgress.checkCompletionCallback = checkCompletionCallback;
        this._renderProgress(0, CONFIG.PROGRESS_MESSAGES[0]);

        if (this.simProgress.timerId) {
            clearInterval(this.simProgress.timerId);
        }
        this._clear99Timers();

        this.simProgress.timerId = setInterval(() => {
            if (this.simProgress.percent >= CONFIG.PROGRESS.MAX_SIM_PERCENT) {
                // Досягли 99% — запускаємо спеціальні повідомлення
                if (this.simProgress.at99Timers.length === 0) {
                    this._start99Messages();
                }
                return;
            }
            
            this.simProgress.percent += 1;
            
            // Перевіряємо завершення процесу кожні 8%
            if (this.simProgress.percent % 8 === 0 && this.simProgress.checkCompletionCallback) {
                console.log(`🔍 [UIController] Перевірка завершення процесу на ${this.simProgress.percent}%`);
                if (this.simProgress.checkCompletionCallback()) {
                    console.log('✅ [UIController] Процес завершено достроково, зупинка прогресбару');
                    this.finishSimulatedProgress();
                    return;
                }
            }
            
            // Змінюємо повідомлення тільки кожні 5%
            let msg;
            if (this.simProgress.percent % CONFIG.PROGRESS.MESSAGE_CHANGE_PERCENT === 0) {
                this.simProgress.messageIndex = Math.floor(this.simProgress.percent / CONFIG.PROGRESS.MESSAGE_CHANGE_PERCENT) % CONFIG.PROGRESS_MESSAGES.length;
                msg = CONFIG.PROGRESS_MESSAGES[this.simProgress.messageIndex];
            } else {
                // Залишаємо попереднє повідомлення
                msg = this.elements.loadingStage.textContent;
            }
            
            this._renderProgress(this.simProgress.percent, msg);
        }, CONFIG.PROGRESS.TICK_MS);
    }

    // Запуск послідовних повідомлень на 99%
    _start99Messages() {
        console.log('😅 [UIController] Досягли 99%, запуск спеціальних повідомлень');
        CONFIG.PROGRESS_99_MESSAGES.forEach(({ delay, text }) => {
            const timer = setTimeout(() => {
                this._renderProgress(99, text);
            }, delay);
            this.simProgress.at99Timers.push(timer);
        });
    }

    _clear99Timers() {
        this.simProgress.at99Timers.forEach(timer => clearTimeout(timer));
        this.simProgress.at99Timers = [];
    }

    // Миттєво сховати прогресбар (коли процеси завершені раніше)
    finishSimulatedProgress() {
        console.log('✅ [UIController] Завершення симульованого прогресу');
        if (this.simProgress.timerId) clearInterval(this.simProgress.timerId);
        this.simProgress.timerId = null;
        this._clear99Timers();
        this.resetProgress();
    }

    // Зупинити і скинути без зміни кроку (для обробки помилки)
    stopSimulatedProgress() {
        console.log('🛑 [UIController] Зупинка симульованого прогресу');
        if (this.simProgress.timerId) clearInterval(this.simProgress.timerId);
        this.simProgress.timerId = null;
        this._clear99Timers();
        this.resetProgress();
    }

    _renderProgress(percent, message) {
        this.elements.progressBar.style.width = percent + '%';
        this.elements.progressPercent.textContent = percent + '%';
        this.elements.loadingStage.textContent = message;
        console.log(`📊 [UIController] Прогрес: ${percent}% — ${message}`);
    }
}
