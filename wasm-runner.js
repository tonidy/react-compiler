/**
 * WASM Runner Abstraction Layer
 * Common interface for all WASM compilers (esbuild, SWC, etc.)
 */

/**
 * Base class for WASM runners
 */
export class WasmRunner {
  /**
   * Initialize the WASM module
   * Must be called before compilation
   */
  async initialize() {
    throw new Error('initialize() must be implemented');
  }

  /**
   * Compile/transform code
   * @param {Object} options - Compiler options
   * @returns {Object} { code, sourceMap?, warnings? }
   */
  async compile(options) {
    throw new Error('compile() must be implemented');
  }

  /**
   * Compile and execute the bundled code
   * @param {Object} options - Compiler options
   * @returns {string} The bundled code
   */
  async compileAndRun(options) {
    throw new Error('compileAndRun() must be implemented');
  }

  /**
   * Get runner capabilities
   * @returns {Object} { bundling, jsx, typescript, ... }
   */
  getCapabilities() {
    throw new Error('getCapabilities() must be implemented');
  }
}

/**
 * Factory function to create runners
 * @param {string} type - Runner type: 'esbuild', 'swc', etc.
 * @returns {WasmRunner} Runner instance
 */
export async function createRunner(type = 'esbuild') {
  switch (type) {
    case 'esbuild': {
      const { EsbuildRunner } = await import('./runners/esbuild-runner.js');
      return new EsbuildRunner();
    }
    case 'swc': {
      const { SwcRunner } = await import('./runners/swc-runner.js');
      return new SwcRunner();
    }
    default:
      throw new Error(`Unknown runner: ${type}`);
  }
}
