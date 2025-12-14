/**
 * Playground Entry Point
 * Orchestrates compilation and provides live editing capabilities
 */

import { createRunner } from './wasm-runner.js';

const statusEl = document.getElementById('status');
const rootEl = document.getElementById('root');
const capabilitiesEl = document.getElementById('capabilities');
const compilerSelect = document.getElementById('compiler-select');

let currentRunner = null;

/**
 * Update status display
 */
function setStatus(message, type = 'loading') {
  statusEl.textContent = message;
  statusEl.className = type;
}

/**
 * Display capabilities
 */
function displayCapabilities(capabilities) {
  const caps = Object.entries(capabilities)
    .filter(([key]) => key !== 'note')
    .map(([key, value]) => `${key}: ${value ? '✓' : '✗'}`)
    .join(' • ');

  let html = caps;
  if (capabilities.note) {
    html += ` • ${capabilities.note}`;
  }

  capabilitiesEl.textContent = html;
  capabilitiesEl.style.display = 'block';
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Display error in the root element
 */
function showError(error) {
  const message = error.message || String(error);
  rootEl.innerHTML = `
    <div class="error-box">
      <strong>Compilation Error:</strong>
      <br><br>
      ${escapeHtml(message)}
    </div>
  `;
}

/**
 * Initialize and compile with selected runner
 */
async function compileApp(compilerType) {
  try {
    setStatus(`Initializing ${compilerType}...`, 'loading');

    // Create runner
    currentRunner = await createRunner(compilerType);

    // Initialize
    await currentRunner.initialize();

    // Display capabilities
    displayCapabilities(currentRunner.getCapabilities());

    // Compile and run
    setStatus(`Compiling with ${compilerType}...`, 'loading');
    await currentRunner.compileAndRun({
      entryPoint: '@/entry',
      baseUrl: '/src'
    });

    // Success
    setStatus(`✓ App running with ${compilerType}!`, 'success');

  } catch (error) {
    console.error(`[playground] Error:`, error);
    setStatus(`Error: ${error.message}`, 'error');
    showError(error);
  }
}

/**
 * Handle compiler selection change
 */
compilerSelect.addEventListener('change', (event) => {
  const compilerType = event.target.value;
  compileApp(compilerType);
});

/**
 * Main initialization
 */
async function main() {
  try {
    const initialCompiler = compilerSelect.value || 'esbuild';
    await compileApp(initialCompiler);
  } catch (error) {
    console.error('[playground] Init error:', error);
    setStatus(`Fatal error: ${error.message}`, 'error');
    showError(error);
  }
}

// Start the application
main();

// Export for potential live editing extension
export { compileApp as recompile };
