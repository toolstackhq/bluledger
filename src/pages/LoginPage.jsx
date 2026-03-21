import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import InfoBanner from "../components/InfoBanner";

function LoginPage() {
  const { appMeta, demoCredentials, rememberedCustomerId, login } = useAppContext();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState(rememberedCustomerId || "");
  const [password, setPassword] = useState("");
  const [rememberCustomerId, setRememberCustomerId] = useState(
    Boolean(rememberedCustomerId)
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCustomerId(rememberedCustomerId || "");
    setRememberCustomerId(Boolean(rememberedCustomerId));
  }, [rememberedCustomerId]);

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

    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-panel-wrap">
        <div className="login-panel">
          <div className="login-panel__brand">
            <h1>BluLedger</h1>
            <p>Digital Banking Demo</p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="customerId">Customer ID</label>
              <input
                id="customerId"
                type="text"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                data-testid="login-customer-id"
              />
              {errors.customerId ? <span className="form-error">{errors.customerId}</span> : null}
            </div>

            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                data-testid="login-password"
              />
              {errors.password ? <span className="form-error">{errors.password}</span> : null}
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={rememberCustomerId}
                onChange={(event) => setRememberCustomerId(event.target.checked)}
              />
              <span>Remember customer ID</span>
            </label>

            {errors.form ? <span className="form-error">{errors.form}</span> : null}

            <button type="submit" className="button-primary" data-testid="login-submit">
              Sign in
            </button>
          </form>

          <div className="login-panel__meta">
            <InfoBanner
              title="Demo credentials"
              message={`Customer ID: ${demoCredentials.customerId} | Password: ${demoCredentials.password}`}
            />
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
    </div>
  );
}

export default LoginPage;
