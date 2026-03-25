function LoadingOverlay({ message, mode }) {
  return (
    <div className="app-loading-overlay" data-testid="app-loading-overlay" role="status" aria-live="polite">
      <div className="app-loading-overlay__card">
        <div className="app-loading-overlay__spinner" aria-hidden="true" />
        <div className="app-loading-overlay__eyebrow">Performance mode: {mode}</div>
        <h2>Loading interface</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
