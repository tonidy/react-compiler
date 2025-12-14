/**
 * File Loader Module
 * Handles fetching source files and managing the virtual file system
 */

const EXTENSION_PRIORITY = ['.tsx', '.ts', '.jsx', '.js'];

/**
 * Resolve a module path to its actual file path
 * Handles @/ alias and extension resolution
 */
export function resolveModulePath(importPath, baseUrl = '/src') {
  let normalizedPath = importPath;
  if (importPath.startsWith('@/')) {
    normalizedPath = importPath.replace('@/', '/');
  }
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Fetch a source file with automatic extension resolution
 */
export async function fetchSourceFile(modulePath, baseUrl = '/src') {
  const resolvedBase = resolveModulePath(modulePath, baseUrl);

  // Check if path already has an extension
  const hasExtension = EXTENSION_PRIORITY.some(ext => modulePath.endsWith(ext));

  if (hasExtension) {
    const response = await fetch(resolvedBase);
    if (response.ok) {
      const contents = await response.text();
      return {
        contents,
        loader: getLoader(modulePath),
        resolvedPath: resolvedBase
      };
    }
    throw new Error(`File not found: ${resolvedBase} (status: ${response.status})`);
  }

  // Try each extension in order
  for (const ext of EXTENSION_PRIORITY) {
    const pathWithExt = `${resolvedBase}${ext}`;
    try {
      const response = await fetch(pathWithExt);
      if (response.ok) {
        const contents = await response.text();

        // Validate it's not HTML (404 page)
        const trimmed = contents.trim().toLowerCase();
        if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
          console.log(`[file-loader] Got HTML for ${pathWithExt}, skipping`);
          continue;
        }

        console.log(`[file-loader] Loaded ${pathWithExt} (${contents.length} bytes)`);
        return {
          contents,
          loader: getLoader(pathWithExt),
          resolvedPath: pathWithExt
        };
      } else {
        console.log(`[file-loader] ${pathWithExt}: ${response.status}`);
      }
    } catch (e) {
      console.log(`[file-loader] Fetch error for ${pathWithExt}:`, e.message);
      // Continue to next extension
    }
  }

  throw new Error(`Could not resolve module: ${modulePath}. Tried: ${EXTENSION_PRIORITY.map(e => resolvedBase + e).join(', ')}`);
}

/**
 * Determine the esbuild/swc loader based on file extension
 */
export function getLoader(filePath) {
  if (filePath.endsWith('.tsx')) return 'tsx';
  if (filePath.endsWith('.ts')) return 'ts';
  if (filePath.endsWith('.jsx')) return 'jsx';
  if (filePath.endsWith('.js')) return 'js';
  if (filePath.endsWith('.css')) return 'css';
  if (filePath.endsWith('.json')) return 'json';
  return 'js';
}

/**
 * Create a virtual file system cache
 */
export function createFileCache() {
  const cache = new Map();

  return {
    get(path) {
      return cache.get(path);
    },

    set(path, content) {
      cache.set(path, content);
    },

    has(path) {
      return cache.has(path);
    },

    clear() {
      cache.clear();
    },

    list() {
      return Array.from(cache.keys());
    }
  };
}
