// src/ui/pages/RolePage.js
// Pantalla inicial: permite elegir el rol con el que se usará la app.

import { setState } from "../../state/state.js";
import { triggerRender } from "../render.js";
import { t } from "../../i18n/i18n.js";
import { addLog, LOG_EVENTS, getLogs } from "../../services/logService.js";

export function createRolePage() {
  const container = document.createElement("main");
  container.className = "card";

  const title = document.createElement("div");
  title.className = "card__title";
  title.textContent = t("role.title");

  const grid = document.createElement("div");
  grid.className = "role-grid";

  grid.append(
    createRoleCard({
      accent: "teacher",
      shortKey: "role.teacherShort",
      titleKey: "role.teacher",
      descKey: "role.teacherDesc",
      onSelect: () => selectRole("teacher"),
    }),
    createRoleCard({
      accent: "student",
      shortKey: "role.studentShort",
      titleKey: "role.student",
      descKey: "role.studentDesc",
      onSelect: () => selectRole("student"),
    }),
  );

  const logsButton = document.createElement("button");
  logsButton.type = "button";
  logsButton.className = "btn btn--secondary";
  logsButton.textContent = "Ver últimos 20 logs";

  const logsContainer = document.createElement("section");
  logsContainer.className = "logs-panel";
  logsContainer.style.display = "none";

  logsButton.addEventListener("click", () => {
    const isHidden = logsContainer.style.display === "none";

    if (isHidden) {
      renderLogs(logsContainer);
      logsContainer.style.display = "block";
      logsButton.textContent = "Ocultar logs";
    } else {
      logsContainer.style.display = "none";
      logsButton.textContent = "Ver últimos 20 logs";
    }
  });

  container.append(title, grid, logsButton, logsContainer);
  return container;
}

function selectRole(role) {
  setState({ role });

  addLog(LOG_EVENTS.ROLE_CHANGE, {
    rolNuevo: role,
    user: localStorage.getItem("userName") || null,
  });

  triggerRender();
}

function createRoleCard({ accent, shortKey, titleKey, descKey, onSelect }) {
  const title = t(titleKey);
  const desc = t(descKey);

  const card = document.createElement("button");
  card.type = "button";
  card.className = "role-card";
  card.dataset.accent = accent;
  card.setAttribute("aria-label", `${title}. ${desc}`);

  const head = document.createElement("div");
  head.className = "role-card__head";

  const iconEl = document.createElement("div");
  iconEl.className = "role-card__icon role-card__icon--letter";
  iconEl.textContent = t(shortKey);

  const titleEl = document.createElement("div");
  titleEl.className = "role-card__title";
  titleEl.textContent = title;

  head.append(iconEl, titleEl);

  const descEl = document.createElement("div");
  descEl.className = "role-card__desc";
  descEl.textContent = desc;

  const hintEl = document.createElement("div");
  hintEl.className = "role-card__hint";
  hintEl.textContent = t("common.tapToSelect");

  card.append(head, descEl, hintEl);
  card.addEventListener("click", onSelect);

  return card;
}

function renderLogs(container) {
  const logs = getLogs()
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);

  container.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = "Últimos 20 logs";

  const textArea = document.createElement("textarea");
  textArea.className = "logs-panel__textarea";
  textArea.readOnly = true;
  textArea.value = JSON.stringify(logs, null, 2);

  container.append(title, textArea);
}