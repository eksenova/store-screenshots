const cache = new Map<string, HTMLImageElement>();
const loading = new Map<string, Promise<HTMLImageElement>>();
const listeners = new Set<() => void>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = cache.get(src);
  if (cached) return Promise.resolve(cached);

  const existing = loading.get(src);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cache.set(src, img);
      loading.delete(src);
      // Notify all listeners that a new image is available
      notifyListeners();
      resolve(img);
    };
    img.onerror = () => {
      loading.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });

  loading.set(src, promise);
  return promise;
}

export function getCachedImage(src: string): HTMLImageElement | null {
  const cached = cache.get(src);
  if (cached) return cached;

  // Trigger async load if not cached — canvas will re-render when loaded
  if (!loading.has(src) && src) {
    loadImage(src).catch(() => {});
  }

  return null;
}

/**
 * Preload multiple images in parallel and return when all are loaded.
 */
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.filter(Boolean).map((src) => loadImage(src)));
}

/**
 * Subscribe to image load events — triggers canvas re-render.
 */
export function onImageLoaded(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners(): void {
  for (const cb of listeners) {
    cb();
  }
}

export function clearCache(): void {
  cache.clear();
  loading.clear();
}
