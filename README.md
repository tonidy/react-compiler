# ReactCompile

A browser-based React IDE that compiles React apps in the browser using WASM compilers.

## Features

- **In-Browser Compilation**: Compile React using esbuild-wasm or @swc/wasm-web
- **Live Editor**: Edit React components with auto-recompile (500ms debounce)
- **File Explorer**: Navigate and edit source files (`entry.tsx`, `button.tsx`, `utils.js`)
- **Dark/Light Theme**: Toggle theme with persistent localStorage storage
- **Isolated Preview**: Render compiled apps in sandboxed iframes

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## How It Works

1. **File Loading** (`file-loader.js`): Fetch and cache source files with extension resolution
2. **Compilation**: Choose between esbuild or SWC to bundle/transform React code
3. **Module System**:
   - **esbuild**: Full bundling with virtual filesystem plugin
   - **SWC**: File transformation + custom CommonJS module loader
4. **Iframe Rendering**: Execute compiled code in sandboxed iframe with `allow-scripts` only
5. **Theme Support**: Inject theme colors via `window.__THEME__` before module execution

## Architecture

```
entry.tsx (React app with hooks)
    ↓
file-loader.js (fetch + resolve imports)
    ↓
esbuild-runner.js or swc-runner.js (compile)
    ↓
iframe (execute with theme isolation)
```

## Tech Stack

- **React**: 19.2.3 (via esm.sh CDN)
- **esbuild-wasm**: Browser-based bundler (v0.27.1)
- **@swc/wasm-web**: Rust-based transformer
- **Vite 7**: Dev server with custom middleware for raw source serving

## Files

- `index.html` - IDE UI with file explorer, editor, preview
- `playground.js` - Main orchestration and theme management
- `file-loader.js` - Dynamic file fetching with path alias support
- `runners/esbuild-runner.js` - esbuild compilation pipeline
- `runners/swc-runner.js` - SWC transformation + CommonJS bundling
- `src/entry.tsx` - Example React app with counter, todo list, time display
- `src/components/ui/button.tsx` - Theme-aware button component
- `src/lib/utils.js` - Utility functions
