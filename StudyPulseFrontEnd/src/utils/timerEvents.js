export function dispatchSessionStopped() {
  window.dispatchEvent(new CustomEvent("studypulse:session-stopped"));
}

export function subscribeSessionStopped(handler) {
  window.addEventListener("studypulse:session-stopped", handler);
  return () => window.removeEventListener("studypulse:session-stopped", handler);
}
