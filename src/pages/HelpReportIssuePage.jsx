import { useState } from "react";
import InfoBanner from "../components/InfoBanner";
import HelpLayout from "../components/HelpLayout";
import SectionPanel from "../components/SectionPanel";

function HelpReportIssuePage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <HelpLayout
      title="Report Issue"
      subtitle="Document app issues with enough detail for engineering triage."
    >
      <InfoBanner
        title="Upcoming diagnostics workspace"
        message="This page will later host nested iframe troubleshooting tools. For now it captures the report details directly."
        tone="warning"
      />
      <SectionPanel
        title="Issue Report"
        subtitle="Describe what happened, where it occurred, and how urgent it is."
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="inline-grid">
            <div className="form-row">
              <label htmlFor="help-issue-area">Page or workflow</label>
              <select id="help-issue-area" defaultValue="transfers">
                <option value="transfers">Transfers</option>
                <option value="cards">Cards</option>
                <option value="statements">Statements</option>
                <option value="help">Help centre</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="help-issue-severity">Severity</label>
              <select id="help-issue-severity" defaultValue="major">
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="help-issue-summary">Summary</label>
            <input
              id="help-issue-summary"
              type="text"
              defaultValue="Transfer review screen did not show the expected pending badge"
            />
          </div>
          <div className="form-row">
            <label htmlFor="help-issue-steps">Reproduction steps</label>
            <textarea
              id="help-issue-steps"
              defaultValue="1. Sign in as the seeded customer. 2. Schedule a future-dated payment. 3. Review the confirmation state."
            />
          </div>
          <div className="button-row">
            <button className="button-primary" type="submit">Raise issue</button>
          </div>
          {submitted ? <div className="form-hint">Issue submitted to the training support queue.</div> : null}
        </form>
      </SectionPanel>
    </HelpLayout>
  );
}

export default HelpReportIssuePage;
