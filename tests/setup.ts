const jsdomWindow = (globalThis as any).jsdom?.window;
if (jsdomWindow) {
  if (jsdomWindow.localStorage) {
    Object.defineProperty(globalThis, "localStorage", {
      value: jsdomWindow.localStorage,
      writable: true,
      configurable: true,
    });
  }
  if (jsdomWindow.sessionStorage) {
    Object.defineProperty(globalThis, "sessionStorage", {
      value: jsdomWindow.sessionStorage,
      writable: true,
      configurable: true,
    });
  }
}
