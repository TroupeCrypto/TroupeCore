const PATCH_FLAG = Symbol.for("troupe.safeConsolePatched");

function bindConsoleMethod(target, value, fallback) {
  if (typeof value === "function") {
    return value.bind(target);
  }
  if (value == null) {
    return fallback;
  }
  return value;
}

export function ensureSafeConsole() {
  if (typeof globalThis === "undefined") {
    return undefined;
  }

  const existingConsole = globalThis.console;
  if (!existingConsole) {
    return undefined;
  }

  if (existingConsole[PATCH_FLAG]) {
    return existingConsole;
  }

  const target = existingConsole;
  const fallback = typeof target.log === "function" ? target.log.bind(target) : () => {};

  const proxy = new Proxy(target, {
    get(original, property, receiver) {
      if (property === PATCH_FLAG) {
        return true;
      }

      const value = Reflect.get(original, property, receiver);

      if (typeof property === "string") {
        return bindConsoleMethod(original, value, fallback);
      }

      return value;
    },
  });

  Object.defineProperty(proxy, PATCH_FLAG, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
  });

  globalThis.console = proxy;
  return proxy;
}

ensureSafeConsole();

export default ensureSafeConsole;
