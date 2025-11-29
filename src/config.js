// Configuration Constants
export const CONFIG = {
    POSITIONS: ['викладач', 'асистент', 'аспірант'],
    SHORT_POSITIONS: ['викл.', 'ас.', 'асп.'],
    BG_COLORS: ['#3C60AA', '#ACD6F3', '#8CB8E4'],
    
    SIZES: {
        WEB: { width: 360, height: 500 },
        PRINT: { width: 1240, height: 1748 },
        PDF: { width: 105, height: 148 }, // mm
        MAX_HEIGHT: 1748
    },
    
    STAGE_NAMES: {
        'compute:inference': 'Аналіз зображення...',
        'compute:onnx': 'Обробка нейромережею...',
        'encode:png': 'Збереження результату...',
        'fetch:model': 'Завантаження моделі...',
        'decode:image': 'Розпакування фотографії...'
    },
    
    DEVICE_MODE: 'cpu',
    DOWNSIZE_QUALITY: 0.85,
    EXPORT_JPG_QUALITY: 0.9
};
