import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BrandLockup from "../components/BrandLockup";
import InfoBanner from "../components/InfoBanner";
import PerformanceSettingsButton from "../components/PerformanceSettingsButton";
import PerformanceSettingsPanel from "../components/PerformanceSettingsPanel";
import { trackEvent } from "../lib/analytics";

function LoginPage() {
  const { appMeta, rememberedCustomerId, testUsers, login } = useAppContext();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState(rememberedCustomerId || "");
  const [password, setPassword] = useState("");
  const [rememberCustomerId, setRememberCustomerId] = useState(
    Boolean(rememberedCustomerId)
  );
  const [errors, setErrors] = useState({});
  const [showTestUsers, setShowTestUsers] = useState(false);
  const [showPerformanceSettings, setShowPerformanceSettings] = useState(false);

  useEffect(() => {
    setCustomerId(rememberedCustomerId || "");
    setRememberCustomerId(Boolean(rememberedCustomerId));
  }, [rememberedCustomerId]);

  function handlePrefill(testUser) {
    setCustomerId(testUser.customerId);
    setPassword(testUser.password);
    setErrors({});
    setShowTestUsers(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!customerId.trim()) {
      nextErrors.customerId = "Enter your customer ID.";
    }

    if (!password.trim()) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = login(customerId.trim(), password, rememberCustomerId);

    if (!result.ok) {
      setErrors({ form: result.message });
      return;
    }

    trackEvent("login_success");
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-page__controls">
        <PerformanceSettingsButton onClick={() => setShowPerformanceSettings(true)} />
      </div>
      <div className="login-panel-wrap">
        <div className="login-panel">
          <div className="login-panel__brand">
            <BrandLockup large subtitle={appMeta.subtitle} />
          </div>

          <form className="form-grid" id="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="customerId">Customer ID</label>
              <input
                id="customerId"
                type="text"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                data-testid="login-customer-id"
                autoComplete="username"
                aria-invalid={Boolean(errors.customerId)}
                aria-describedby={errors.customerId ? "customerId-error" : undefined}
              />
              {errors.customerId ? (
                <span className="form-error" id="customerId-error" role="alert">
                  {errors.customerId}
                </span>
              ) : null}
            </div>

            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                data-testid="login-password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password ? (
                <span className="form-error" id="password-error" role="alert">
                  {errors.password}
                </span>
              ) : null}
            </div>

            <label className="checkbox-row" htmlFor="rememberCustomerId">
              <input
                id="rememberCustomerId"
                type="checkbox"
                checked={rememberCustomerId}
                onChange={(event) => setRememberCustomerId(event.target.checked)}
              />
              <span>Remember customer ID</span>
            </label>

            {errors.form ? (
              <span className="form-error" id="login-form-error" role="alert">
                {errors.form}
              </span>
            ) : null}

            <button
              id="login-submit-button"
              type="submit"
              className="button-primary"
              data-testid="login-submit"
            >
              Sign in
            </button>
          </form>

          <div className="login-panel__meta">
            <div className="login-panel__assist">
              <button
                id="view-test-users-button"
                type="button"
                className="text-link-button"
                onClick={() => setShowTestUsers(true)}
                data-testid="login-view-test-users"
                aria-haspopup="dialog"
                aria-expanded={showTestUsers}
                aria-controls="test-users-dialog"
              >
                View Test Users
              </button>
            </div>
            <InfoBanner
              title="Security note"
              message={appMeta.securityNotice}
              tone="warning"
            />
          </div>
        </div>

        <div className="footer-note">
          Need assistance? Call {appMeta.helpPhone}. Support hours: {appMeta.supportHours}.
        </div>
      </div>

      {showTestUsers ? (
        <div className="modal-overlay" onClick={() => setShowTestUsers(false)}>
          <div
            id="test-users-dialog"
            className="test-users-dialog"
            onClick={(event) => event.stopPropagation()}
            data-testid="login-test-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="test-users-title"
            aria-describedby="test-users-description"
          >
            <div className="test-users-dialog__header">
              <div>
                <h2 id="test-users-title">Test Users</h2>
                <p id="test-users-description">Select a persona to prefill the sign-in form.</p>
              </div>
              <button
                id="close-test-users-button"
                type="button"
                className="button-secondary"
                onClick={() => setShowTestUsers(false)}
                aria-label="Close test users dialog"
              >
                Close
              </button>
            </div>
            <div className="test-users-dialog__list">
              {testUsers.map((testUser, index) => (
                <button
                  id={`test-user-prefill-${index + 1}`}
                  key={testUser.customerId}
                  type="button"
                  className="test-users-dialog__item"
                  onClick={() => handlePrefill(testUser)}
                  aria-label={`Use ${testUser.scenarioLabel}. Customer ID ${testUser.customerId}. Password ${testUser.password}. ${testUser.scenarioDescription}`}
                >
                  <div className="test-users-dialog__title">{testUser.scenarioLabel}</div>
                  <div className="table-subline">{testUser.scenarioDescription}</div>
                  <div className="test-users-dialog__credentials">
                    <span>Customer ID: {testUser.customerId}</span>
                    <span>Password: {testUser.password}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showPerformanceSettings ? (
        <div className="performance-settings-anchor" id="performance-settings-drawer">
          <PerformanceSettingsPanel onClose={() => setShowPerformanceSettings(false)} />
        </div>
      ) : null}
    </div>
  );
}

export default LoginPage;
