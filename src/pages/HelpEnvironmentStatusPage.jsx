import { useEffect, useRef, useState } from "react";
import HelpLayout from "../components/HelpLayout";
import SectionPanel from "../components/SectionPanel";

const ENVIRONMENT_STATUS_ATTEMPT_KEY = "bluledger-help-environment-status-attempt-v1";

const STATUS_ITEMS = [
  {
    label: "Core API",
    value: "Recovered after intermittent upstream handshake failures",
  },
  {
    label: "Payments queue",
    value: "Clearing backlog and replaying delayed settlement events",
  },
  {
    label: "Document export",
    value: "Available, but response times remain inconsistent",
  },
];

function readAttemptCount() {
  const rawValue = window.sessionStorage.getItem(ENVIRONMENT_STATUS_ATTEMPT_KEY);
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function writeAttemptCount(value) {
  window.sessionStorage.setItem(ENVIRONMENT_STATUS_ATTEMPT_KEY, String(value));
}

function determineAttemptOutcome(attemptNumber) {
  return attemptNumber % 3 === 0 ? "success" : "failure";
}

function HelpEnvironmentStatusPage() {
  const timeoutRef = useRef(null);
  const [loadState, setLoadState] = useState({
    attemptNumber: 0,
    phase: "idle",
  });

  function runLoadAttempt() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const nextAttempt = readAttemptCount() + 1;
    writeAttemptCount(nextAttempt);

    setLoadState({
      attemptNumber: nextAttempt,
      phase: "loading",
    });

    timeoutRef.current = window.setTimeout(() => {
      setLoadState({
        attemptNumber: nextAttempt,
        phase: determineAttemptOutcome(nextAttempt),
      });
      timeoutRef.current = null;
    }, 650);
  }

  useEffect(() => {
    const bootstrapTimer = window.setTimeout(() => {
      runLoadAttempt();
    }, 0);

    return () => {
      window.clearTimeout(bootstrapTimer);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const cycleStep = ((loadState.attemptNumber - 1) % 3) + 1;

  return (
    <HelpLayout
      title="Environment Status"
      subtitle="A deliberately unstable training page that forces testers to handle intermittent load failures."
    >
      <SectionPanel
        title="Snapshot Loader"
        subtitle="This page intentionally fails two out of every three attempts in the current session."
        testId="help-environment-status-panel"
      >
        <div className="page-stack">
          <div className="form-hint" data-testid="help-environment-status-attempt">
            Attempt {loadState.attemptNumber || 1} of the current session cycle. Success arrives on
            every third try.
          </div>

          {loadState.phase === "loading" ? (
            <div
              className="panel panel--soft"
              data-testid="help-environment-status-loading"
              aria-live="polite"
            >
              <div className="form-hint">
                Loading the lower-environment status snapshot...
              </div>
            </div>
          ) : null}

          {loadState.phase === "failure" ? (
            <div
              className="page-stack"
              data-testid="help-environment-status-error"
              role="alert"
            >
              <h3>Sorry, the environment snapshot failed to load.</h3>
              <p>
                This training page simulates a noisy lower environment. Attempt {cycleStep} in this
                cycle returned a recoverable error.
              </p>
              <div className="button-row">
                <button
                  type="button"
                  className="button-primary"
                  onClick={runLoadAttempt}
                  data-testid="help-environment-status-retry"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {loadState.phase === "success" ? (
            <div className="page-stack" data-testid="help-environment-status-content">
              <div className="form-hint">
                The snapshot finally loaded. This is the validation target after scripted retries.
              </div>
              <dl className="help-summary-list">
                {STATUS_ITEMS.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </SectionPanel>
    </HelpLayout>
  );
}

export default HelpEnvironmentStatusPage;
