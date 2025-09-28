export function wipeLocalSession() {
  window.electronAPI.wipeSignalData();
}

export function showRelinkModal() {
  // Show UI for device re-linking (QR code flow)
  // Implementation depends on your app logic
}