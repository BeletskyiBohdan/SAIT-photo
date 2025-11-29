# Portrait Photo Processing App - Refactored

## Architecture Overview

Повністю рефакторизована версія з модульною архітектурою та поділом відповідальності.

### Project Structure

```
prjct/
├── src/
│   ├── main.js              # Entry point
│   ├── app.js               # Main application controller
│   ├── state.js             # Application state management
│   ├── config.js            # Configuration constants
│   ├── ui.js                # UI controller
│   ├── imageProcessor.js    # Image processing utilities
│   ├── cropper.js           # Cropper management
│   ├── export.js            # Export manager (ZIP, PDF)
│   ├── serviceWorker.js     # Service worker utilities
│   └── preload.js           # Model preloader
├── styles/
│   ├── main.css             # Main styles
│   └── loading.css          # Loading & progress styles
├── public/
│   └── sw.js                # Service worker
├── index-refactored.html    # Refactored HTML entry
├── vite.config.js
└── package.json
```

### Key Improvements

#### 1. **Модульна Архітектура**
- Кожен модуль має єдину відповідальність (Single Responsibility Principle).
- ES6 модулі для чистого імпорту/експорту.
- Легке тестування окремих компонентів.

#### 2. **Класи та Інкапсуляція**
- `App` — головний контролер координує всі модулі.
- `AppState` — централізоване управління станом додатка.
- `UIController` — вся логіка UI в одному місці.
- `ImageProcessor` — обробка зображень (downsizing, background removal).
- `CropperManager` — обгортка для Cropper.js з простим API.
- `ExportManager` — експорт у ZIP, PDF з централізованою логікою.

#### 3. **Конфігурація**
- Всі магічні числа та рядки винесені в `config.js`.
- Легко змінити розміри, кольори, тексти без пошуку по коду.

#### 4. **Чистий Розділ HTML/CSS/JS**
- HTML містить тільки структуру.
- CSS винесений в окремі файли за функціональністю.
- JS модулі не змішують логіку з розміткою.

#### 5. **Async/Await Паттерни**
- Весь асинхронний код використовує async/await замість callbacks.
- Promise-based API для кращої читабельності.

#### 6. **Легке Розширення**
- Додати нову посаду: змінити `CONFIG.POSITIONS`.
- Додати новий етап обробки: розширити `ImageProcessor`.
- Змінити UI: редагувати `UIController`.

### Migration from Old Version

Стара версія — один великий `index.html` з усією логікою в `<script type="module">`.

Нова версія:
- **8 модулів JS** з чіткими обов'язками.
- **2 CSS файли** замість inline стилів.
- **Простий HTML** без вбудованого коду.

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Testing Locally

```bash
npm run serve:dist
```

### Benefits

1. **Maintainability**: Легко знайти і змінити потрібний функціонал.
2. **Scalability**: Простіше додавати нові фічі без ризику зламати існуючі.
3. **Testability**: Кожен клас можна тестувати ізольовано.
4. **Readability**: Код читається як документація.
5. **Reusability**: Модулі можна використовувати в інших проєктах.

### Class Diagram

```
App (main controller)
  ├── AppState (state management)
  ├── UIController (UI interactions)
  ├── ImageProcessor (image processing)
  │   └── uses: removeBackground from @imgly
  ├── CropperManager (cropping logic)
  │   └── uses: Cropper from cropperjs
  └── ExportManager (ZIP/PDF export)
      └── uses: JSZip, jsPDF
```

### Next Steps

Можливі покращення:
- TypeScript для type safety.
- Unit tests (Jest/Vitest).
- E2E tests (Playwright).
- Webpack/Rollup замість Vite (опціонально).
- i18n для мультимовності.
- State management (Zustand/Redux якщо додатьматься складність).
