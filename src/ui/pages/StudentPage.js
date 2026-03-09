// src/ui/pages/StudentPage.js
// Panel del estudiante: captura el código de sesión y prepara el flujo para unirse (futuro async).

import { state, setUI, resetApp } from "../../state/state.js";
import { triggerRender } from "../render.js";
import { t } from "../../i18n/i18n.js";

export function createStudentPage() {
  const container = document.createElement("main");
  container.className = "card";

  const title = document.createElement("div");
  title.className = "card__title";
  title.textContent = t("student.title");

  const intro = document.createElement("p");
  intro.textContent = t("student.intro");

  const info = document.createElement("div");
  info.className = "student-info";
  info.textContent = getStudentInfoText();

  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  label.className = "field__label";
  label.textContent = t("student.codeLabel");

  const feedback = document.createElement("div");
  feedback.className = "field__feedback";


  const input = document.createElement("input");
  input.className = "input";
  input.type = "text";
  input.inputMode = "numeric";
  input.autocomplete = "one-time-code";
  input.placeholder = t("student.codePlaceholder");
  input.value = state.ui?.studentCodeDraft || "";

  let cleanTimer = null;

  input.addEventListener("input", (e) => {
    const value = String(e.target.value ?? "");

    // cancelar limpieza anterior
    clearTimeout(cleanTimer);

    cleanTimer = setTimeout(() => {

      const cleaned = value.replace(/[^\d]/g, "");

      if (value !== cleaned) {

        input.value = cleaned;

        feedback.textContent = "⚠ " + t("student.Numbers");

        setUI({
          studentCodeDraft: cleaned
        });

      } else {

        feedback.textContent = "";

        setUI({
          studentCodeDraft: cleaned
        });

      }

    }, 500); // espera medio segundo
  });

  field.append(label, input, feedback);

  const btnJoin = document.createElement("button");
  btnJoin.className = "btn btn--primary";
  btnJoin.type = "button";
  btnJoin.textContent = t("student.join");

  btnJoin.addEventListener("click", () => {

    const draft = String(state.ui?.studentCodeDraft || "");
    const code = normalizeCode(draft);

    // código incompleto
    if (code.length < 6) {
      feedback.textContent = "⚠ " + t("student.codeIncomplete");
      return;
    }
    btnJoin.disabled = true;
    // mostrar procesando
    feedback.textContent = "⏳ " + t("student.processing");

    // simulación async
    setTimeout(() => {

      const isValid = code === "202114796"; // código válido simulado

      if (isValid) {

        feedback.textContent = "✅ " + t("student.validCode");

        setUI({
          session: {
            code,
            status: "open"
          }
        });

      } else {

        feedback.textContent = "❌ " + t("student.invalidCode");

      }
      btnJoin.disabled = false;

    }, 1200); // simula espera de servidor
  });

  const btnBack = document.createElement("button");
  btnBack.className = "btn btn--ghost";
  btnBack.type = "button";
  btnBack.textContent = t("role.changeProfile");

  btnBack.addEventListener("click", () => {
    resetApp();
    setUI({ studentCodeDraft: "" });
    triggerRender();
  });

  container.append(title, intro, info, field, btnJoin, btnBack);
  return container;
}

function getStudentInfoText() {
  if (state.session?.code && state.session?.status === "open") {
    return t("student.connectedAs", { code: state.session.code });
  }
  return t("student.notConnected");
}

function normalizeCode(value) {
  // Mantenerlo simple para estudiantes: elimina espacios y deja solo dígitos.
  return String(value).trim().replace(/\s+/g, "").replace(/[^\d]/g, "");
}

function isValidCode(code) {
  // Validación mínima y didáctica: entre 4 y 10 dígitos.
  return typeof code === "string" && code.length >= 4 && code.length <= 10;
}
