const $ = (id) => document.getElementById(id);

/** Shows the loading spinner. */
export function showLoader() {
  const loader = $("loader");
  if (loader) loader.classList.remove("hidden");
}

/** Hides the loading spinner. */
export function hideLoader() {
  const loader = $("loader");
  if (loader) loader.classList.add("hidden");
}

/**
 * Shows a message under the buttons.
 * @param {string} message - Text to display (empty string clears it).
 * @param {boolean} isError - true = red error style, false = green success style.
 */
export function setStatus(message, isError = false) {
  const status = $("status");
  if (!status) return;

  status.textContent = message;
  status.classList.remove("status-error", "status-success");

  if (message) {
    status.classList.add(isError ? "status-error" : "status-success");
  }
}

/** Disables or enables both buttons (prevents double-clicks during a fetch). */
export function setButtonsDisabled(disabled) {
  ["fetch-btn", "clear-btn"].forEach((id) => {
    const btn = $(id);
    if (btn) btn.disabled = disabled;
  });
}
