const SESSION_APP_STATE_KEY = "bluledger-session-app-state-v1";
const LEGACY_APP_STATE_KEY = "bluledger-app-state-v2";
const REMEMBERED_ID_KEY = "bluledger-remembered-id";
const PERFORMANCE_CONFIG_KEY = "bluledger-performance-config-v1";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function loadStoredAppState() {
  window.localStorage.removeItem(LEGACY_APP_STATE_KEY);
  const storedValue = window.sessionStorage.getItem(SESSION_APP_STATE_KEY);

  if (!storedValue) {
    return null;
  }

  return safeJsonParse(storedValue);
}

export function saveStoredAppState(value) {
  window.localStorage.removeItem(LEGACY_APP_STATE_KEY);
  window.sessionStorage.setItem(SESSION_APP_STATE_KEY, JSON.stringify(value));
}

export function clearStoredAppState() {
  window.localStorage.removeItem(LEGACY_APP_STATE_KEY);
  window.sessionStorage.removeItem(SESSION_APP_STATE_KEY);
}

export function loadPerformanceConfig() {
  const storedValue = window.sessionStorage.getItem(PERFORMANCE_CONFIG_KEY);

  if (!storedValue) {
    return null;
  }

  return safeJsonParse(storedValue);
}

export function savePerformanceConfig(value) {
  window.sessionStorage.setItem(PERFORMANCE_CONFIG_KEY, JSON.stringify(value));
}

export function clearPerformanceConfig() {
  window.sessionStorage.removeItem(PERFORMANCE_CONFIG_KEY);
}

export function loadRememberedCustomerId() {
  return window.localStorage.getItem(REMEMBERED_ID_KEY) || "";
}

export function saveRememberedCustomerId(customerId) {
  window.localStorage.setItem(REMEMBERED_ID_KEY, customerId);
}

export function clearRememberedCustomerId() {
  window.localStorage.removeItem(REMEMBERED_ID_KEY);
}
