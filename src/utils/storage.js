const APP_STATE_KEY = "bluledger-app-state";
const REMEMBERED_ID_KEY = "bluledger-remembered-id";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function loadStoredAppState() {
  const storedValue = window.localStorage.getItem(APP_STATE_KEY);

  if (!storedValue) {
    return null;
  }

  return safeJsonParse(storedValue);
}

export function saveStoredAppState(value) {
  window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(value));
}

export function clearStoredAppState() {
  window.localStorage.removeItem(APP_STATE_KEY);
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
