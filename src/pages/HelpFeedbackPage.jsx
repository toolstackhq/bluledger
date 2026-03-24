import { useState } from "react";
import InfoBanner from "../components/InfoBanner";
import HelpLayout from "../components/HelpLayout";
import OpenFeedbackWidget from "../components/OpenFeedbackWidget";
import SectionPanel from "../components/SectionPanel";
import { trackEvent } from "../lib/analytics";

function HelpFeedbackPage() {
  const [lastSubmission, setLastSubmission] = useState(null);

  function handleSubmission(submission) {
    setLastSubmission(submission);
    trackEvent("feedback_submitted", {
      category: submission.category,
      rating: submission.rating,
      allow_follow_up: submission.allowFollowUp,
    });
  }

  return (
    <HelpLayout
      title="Feedback"
      subtitle="Capture product feedback using an open shadow DOM widget that behaves like a real embedded component."
    >
      <InfoBanner
        title="Shadow DOM practice"
        message="The form below is rendered inside an open shadow root. Successful submissions also update the page outside the component."
        tone="info"
      />
      <SectionPanel
        title="Feedback Composer"
        subtitle="Share product feedback with the digital servicing team."
        testId="help-feedback-panel"
      >
        <OpenFeedbackWidget onSubmit={handleSubmission} />
      </SectionPanel>
      <SectionPanel
        title="Submission Snapshot"
        subtitle="This host panel reflects the latest payload emitted from the shadow widget."
        testId="help-feedback-summary-panel"
      >
        <div className="help-summary-card" data-testid="help-feedback-summary">
          {lastSubmission ? (
            <dl className="help-summary-list">
              <div>
                <dt>Category</dt>
                <dd>{lastSubmission.category}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>{lastSubmission.rating}</dd>
              </div>
              <div>
                <dt>Follow-up</dt>
                <dd>{lastSubmission.allowFollowUp ? "Allowed" : "Not requested"}</dd>
              </div>
              <div>
                <dt>Summary</dt>
                <dd>{lastSubmission.summary}</dd>
              </div>
            </dl>
          ) : (
            <div className="form-hint">No feedback has been submitted yet.</div>
          )}
        </div>
      </SectionPanel>
    </HelpLayout>
  );
}

export default HelpFeedbackPage;
