# Portrait Processing Workflow App

A step-by-step in‑browser tool to prepare standardized portrait photographs for both web publication and high‑quality print (A6 105×148 mm at 300 DPI). All processing (background removal, cropping, export) happens locally in the browser for privacy.

## Features
- In-browser background removal via `@imgly/background-removal` (WASM, no server).
- Guided multi-step UX: Upload → Meta (position + name) → Crop Web → Crop Print → Export.
- Distinct color backgrounds based on position:
  - Викладач: `#3C60AA`
  - Асистент: `#ACD6F3`
  - Аспірант: `#8CB8E4`
- Web export: PNG 360×500 px.
- Print export: JPG 1240×1748 px (exact 105mm × 148mm @ 300 DPI equivalent pixel dimensions).
- PDF export: A6 page (105×148 mm) containing the print image.
- ZIP bundle: `(<скорочена посада> <Ім'я>).zip` containing PNG, JPG, PDF.
- Manual cropping for each stage using `CropperJS` with enforced aspect ratios.
- Loading spinner while background removal runs.

## Tech Stack
- Vite (dev server & ES module bundling)
- CropperJS (manual cropping UI)
- JSZip (multi-file ZIP creation)
- jsPDF (PDF generation at real physical dimensions)
- @imgly/background-removal (foreground segmentation)

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```
Open the printed URL (e.g. `http://localhost:5173` or fallback port). If 5173 is busy:
```bash
npm run dev -- --port 5181
```

## Workflow Steps
1. **Upload Photo** – Select an image; processing starts (spinner).
2. **Enter Info** – Choose position, enter name (placeholder `Білецький Б.С.`).
3. **Crop for Web** – Crop to 360×500 aspect; background applied.
4. **Preview Web Result** – Confirm, move to print stage.
5. **Crop for Print** – Crop to 105×148 mm aspect (final high-res).
6. **Preview Print Result** – Export options appear.
7. **Save Bundle** – Downloads ZIP with PNG (web), JPG (print), PDF (print). Shows success message.
8. **Restart** – Start new photo.

## File Naming Convention
```
(<скорочена посада>) (<Ім'я>) - на сайт.png
(<скорочена посада>) (<Ім'я>) - на друк.jpg
(<скорочена посада>) (<Ім'я>) - на друк.pdf
(<скорочена посада>) (<Ім'я>).zip
```
Short position codes:
- викл.
- ас.
- асп.

## DPI / Print Notes
Browsers do not embed DPI metadata automatically in JPEG via Canvas. The pixel dimensions (1240×1748) correspond exactly to 105×148 mm at 300 DPI. PDF export uses physical millimeter units, ensuring print size integrity.

## Licensing Considerations
`@imgly/background-removal` is AGPL-licensed. If you distribute or deploy this app publicly and cannot comply with AGPL terms (e.g., source disclosure), obtain a commercial license from IMG.LY. Review their repository/license for details.

## Potential Enhancements
- Embed EXIF DPI metadata into JPG using a client-side EXIF manipulation library.
- Add drag-and-drop upload.
- Bulk processing queue.
- Accessibility improvements (focus states, ARIA labels beyond spinner).

## GitHub Deployment
1. Create a new repository on GitHub (e.g. `portrait-workflow`).
2. Initialize locally if not done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: portrait processing app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. For subsequent changes:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

## Folder Structure (key files)
```
prjct/
  |- index.html        # Main application (multi-step UI)
  |- package.json      # Dependencies & scripts
  |- server.js         # Optional Node static server with COOP/COEP headers
  |- README.md
  |- .gitignore
```

## Browser Support
Modern Chromium-based browsers recommended (WebAssembly + Offscreen performance). WebGPU/WebGL acceleration improves segmentation speed.

---
Feel free to adjust branding, colors, or add logging as needed.
