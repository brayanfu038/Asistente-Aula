const LOG_STORAGE_KEY = 'asistente_aula_logs';

export const LOG_EVENTS = {
  LANGUAGE_CHANGE: 'LANGUAGE_CHANGE',
  THEME_CHANGE: 'THEME_CHANGE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  COPY_CODE: 'COPY_CODE',
  GO_HOME: 'GO_HOME',
};

function readLogs() {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error leyendo logs del localStorage:', error);
    return [];
  }
}

function writeLogs(logs) {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error guardando logs en localStorage:', error);
  }
}

export function addLog(eventType, details = {}) {
  const now = new Date();

  const logEntry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    eventType,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    details: {
      ...details,
    },
  };

  const logs = readLogs();
  logs.unshift(logEntry);
  writeLogs(logs);
}

export function getLogs() {
  return readLogs();
}

export function clearLogs() {
  localStorage.removeItem(LOG_STORAGE_KEY);
}

export function removeLogById(logId) {
  const logs = readLogs().filter((log) => log.id !== logId);
  writeLogs(logs);
}