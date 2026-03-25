import { useState } from "react";
import { useAppContext } from "../context/AppContext";

function PerformanceSettingsPanel({ onClose }) {
  const {
    performanceConfig,
    resetPerformanceConfig,
    updatePerformanceConfig,
  } = useAppContext();
  const [localConfig, setLocalConfig] = useState(performanceConfig);

  function updateField(field, value) {
    setLocalConfig((currentConfig) => ({
      ...currentConfig,
      [field]: value,
    }));
  }

  function handleSave() {
    updatePerformanceConfig({
      ...localConfig,
      minDelayMs: Number(localConfig.minDelayMs),
      maxDelayMs: Number(localConfig.maxDelayMs),
    });
    onClose();
  }

  function handleReset() {
    resetPerformanceConfig();
    onClose();
  }

  return (
    <section
      className="performance-settings-panel"
      data-testid="performance-settings-panel"
      role="dialog"
      aria-labelledby="performance-settings-title"
      aria-modal="false"
    >
      <div className="performance-settings-panel__header">
        <div>
          <div className="performance-settings-panel__eyebrow">Stability tools</div>
          <h2 id="performance-settings-title">App speed and stability</h2>
          <p>Session-only performance settings for realistic automation waits.</p>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={onClose}
          aria-label="Close performance settings"
        >
          Close
        </button>
      </div>

      <div className="performance-settings-panel__body">
        <div className="form-row">
          <label htmlFor="performance-mode">Mode</label>
          <select
            id="performance-mode"
            data-testid="performance-mode"
            value={localConfig.mode}
            onChange={(event) => updateField("mode", event.target.value)}
          >
            <option value="fast">Fast</option>
            <option value="variable">Variable</option>
            <option value="slow">Slow</option>
          </select>
        </div>

        <div className="inline-grid">
          <div className="form-row">
            <label htmlFor="performance-min-delay">Minimum delay (ms)</label>
            <input
              id="performance-min-delay"
              data-testid="performance-min-delay"
              type="number"
              min="0"
              step="100"
              value={localConfig.minDelayMs}
              onChange={(event) => updateField("minDelayMs", event.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="performance-max-delay">Maximum delay (ms)</label>
            <input
              id="performance-max-delay"
              data-testid="performance-max-delay"
              type="number"
              min="0"
              step="100"
              value={localConfig.maxDelayMs}
              onChange={(event) => updateField("maxDelayMs", event.target.value)}
            />
          </div>
        </div>

        <div className="performance-settings-panel__notes">
          <div className="form-hint">
            Fast disables route delays. Variable adds shorter unpredictable waits. Slow uses
            the configured min and max range on each navigation.
          </div>
          <div className="form-hint">
            These settings live in session storage only, so a fresh tab starts in Fast mode.
          </div>
        </div>
      </div>

      <div className="performance-settings-panel__footer">
        <button
          type="button"
          className="button-secondary"
          onClick={handleReset}
          data-testid="performance-reset"
        >
          Reset
        </button>
        <button
          type="button"
          className="button-primary"
          onClick={handleSave}
          data-testid="performance-save"
        >
          Save
        </button>
      </div>
    </section>
  );
}

export default PerformanceSettingsPanel;
