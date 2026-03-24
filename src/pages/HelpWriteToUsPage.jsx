import { useState } from "react";
import HelpLayout from "../components/HelpLayout";
import SectionPanel from "../components/SectionPanel";

function HelpWriteToUsPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <HelpLayout
      title="Write To Us"
      subtitle="Draft a secure message to the servicing team with a realistic banking enquiry."
    >
      <SectionPanel
        title="Secure Message"
        subtitle="Send a message to the support queue without leaving the authenticated experience."
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="help-write-topic">Topic</label>
            <select id="help-write-topic" defaultValue="payment-follow-up">
              <option value="payment-follow-up">Payment follow-up</option>
              <option value="account-maintenance">Account maintenance</option>
              <option value="document-request">Document request</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="help-write-message">Message</label>
            <textarea
              id="help-write-message"
              defaultValue="Please confirm whether my scheduled transfer will clear before the end of the day."
            />
          </div>
          <div className="button-row">
            <button className="button-primary" type="submit">Send secure message</button>
          </div>
          {submitted ? <div className="form-hint">Message queued in the training inbox.</div> : null}
        </form>
      </SectionPanel>
    </HelpLayout>
  );
}

export default HelpWriteToUsPage;
