import { useState } from "react";
import HelpLayout from "../components/HelpLayout";
import SectionPanel from "../components/SectionPanel";

function HelpFeatureRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <HelpLayout
      title="Feature Request"
      subtitle="Capture ideas for improving the banking experience without leaving the app."
    >
      <SectionPanel
        title="Request Form"
        subtitle="Share an enhancement idea and why it matters to your workflow."
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="inline-grid">
            <div className="form-row">
              <label htmlFor="help-feature-area">Product area</label>
              <select id="help-feature-area" defaultValue="payments">
                <option value="payments">Payments</option>
                <option value="cards">Cards</option>
                <option value="statements">Statements</option>
                <option value="profile">Profile</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="help-feature-impact">Customer impact</label>
              <select id="help-feature-impact" defaultValue="high">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="help-feature-summary">Summary</label>
            <input
              id="help-feature-summary"
              type="text"
              defaultValue="Add clearer transfer status updates in the payment flow"
            />
          </div>
          <div className="form-row">
            <label htmlFor="help-feature-detail">Business value</label>
            <textarea
              id="help-feature-detail"
              defaultValue="Customers should understand whether a transfer is immediate, pending, or waiting on review."
            />
          </div>
          <div className="button-row">
            <button className="button-primary" type="submit">Submit request</button>
          </div>
          {submitted ? <div className="form-hint">Feature request captured for roadmap review.</div> : null}
        </form>
      </SectionPanel>
    </HelpLayout>
  );
}

export default HelpFeatureRequestPage;
