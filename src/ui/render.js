// src/ui/render.js
// Render pipeline simple.
// Permite desacoplar el estado del proceso de renderizado.
//
// Flujo:
// 1. main.js registra la función render principal con registerRender.
// 2. Cuando cambia el estado, se llama triggerRender().
// 3. triggerRender ejecuta la función registrada.

let renderFn = null;

/**
 * Registra la función principal de render.
 * Solo debe llamarse una vez durante la inicialización de la app.
 */
export function registerRender(fn) {
  if (typeof fn !== "function") {
    throw new Error("registerRender requires a function");
  }

  renderFn = fn;
}

/**
 * Ejecuta la función de render registrada.
 * Si no hay función registrada, no hace nada.
 */
export function triggerRender() {
  if (!renderFn) return;

  renderFn();
}
