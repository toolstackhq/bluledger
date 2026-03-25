import { useEffect, useMemo, useState } from "react";
import HighlightedCodeBlock from "./HighlightedCodeBlock";
import {
  AUTOMATION_GUIDE_FRAMEWORKS,
  AUTOMATION_GUIDE_TOPICS,
} from "../data/automationGuide";
import { trackEvent } from "../lib/analytics";

function AutomationGuideDrawer({ onClose }) {
  const [selectedFrameworkId, setSelectedFrameworkId] = useState(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  const selectedFramework = useMemo(
    () =>
      AUTOMATION_GUIDE_FRAMEWORKS.find((framework) => framework.id === selectedFrameworkId) ||
      null,
    [selectedFrameworkId]
  );

  useEffect(() => {
    trackEvent("automation_guide_opened", {
      entry_point: "login",
    });
  }, []);

  function handleFrameworkSelect(frameworkId) {
    trackEvent("automation_guide_framework_selected", {
      framework: frameworkId,
    });
    setSelectedFrameworkId(frameworkId);
    setSelectedTopicIds([]);
  }

  function handleTopicSelect(topicId) {
    trackEvent("automation_guide_topic_selected", {
      framework: selectedFrameworkId || "unknown",
      topic_id: topicId,
    });
    setSelectedTopicIds((currentTopics) => [...currentTopics, topicId]);
  }

  return (
    <section
      className="automation-guide-drawer"
      data-testid="automation-guide-drawer"
      role="dialog"
      aria-labelledby="automation-guide-title"
      aria-modal="false"
    >
      <header className="automation-guide-drawer__header">
        <div>
          <div className="automation-guide-drawer__eyebrow">Login assistant</div>
          <h2 id="automation-guide-title">Automation Guide</h2>
          <p className="automation-guide-drawer__subtitle">
            Find where the app hides each training surface before you start automating.
          </p>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={onClose}
          aria-label="Close automation guide"
        >
          Close
        </button>
      </header>

      <div className="automation-guide-drawer__messages" data-testid="automation-guide-messages">
        <div className="automation-guide-bubble automation-guide-bubble--assistant">
          <p>Pick your framework first so the hints stay relevant.</p>
        </div>

        <div className="automation-guide-chip-row" data-testid="automation-guide-frameworks">
          {AUTOMATION_GUIDE_FRAMEWORKS.map((framework) => (
            <button
              key={framework.id}
              type="button"
              className={
                framework.id === selectedFrameworkId
                  ? "automation-guide-chip automation-guide-chip--selected"
                  : "automation-guide-chip"
              }
              data-testid={`automation-guide-framework-${framework.id}`}
              onClick={() => handleFrameworkSelect(framework.id)}
            >
              {framework.label}
            </button>
          ))}
        </div>

        {selectedFramework ? (
          <>
            <div className="automation-guide-bubble automation-guide-bubble--user">
              <p>{selectedFramework.label}</p>
            </div>

            <div className="automation-guide-bubble automation-guide-bubble--assistant">
              <p>I would like to learn</p>
            </div>

            <div className="automation-guide-chip-row" data-testid="automation-guide-topics">
              {AUTOMATION_GUIDE_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className="automation-guide-chip"
                  data-testid={`automation-guide-topic-${topic.id}`}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {selectedTopicIds.map((topicId, index) => {
          const topic = AUTOMATION_GUIDE_TOPICS.find((item) => item.id === topicId);

          if (!topic || !selectedFramework) {
            return null;
          }

          return (
            <div key={`${topicId}-${index}`} className="automation-guide-thread">
              <div className="automation-guide-bubble automation-guide-bubble--user">
                <p>{topic.label}</p>
              </div>

              <div
                className="automation-guide-bubble automation-guide-bubble--assistant automation-guide-bubble--rich"
                data-testid={`automation-guide-answer-${topic.id}`}
              >
                <div className="automation-guide-answer__header">
                  <strong>{topic.title}</strong>
                  <span className="automation-guide-badge">{selectedFramework.shortLabel}</span>
                </div>
                <p>
                  <strong>Where:</strong> {topic.location}
                </p>
                <p>{topic.instruction}</p>
                <p>{topic.frameworkHints[selectedFramework.id]}</p>
                <p>
                  <strong>Tip:</strong> {topic.tip}
                </p>
                <HighlightedCodeBlock
                  code={topic.sampleCode[selectedFramework.id]}
                  testId={`automation-guide-code-${topic.id}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AutomationGuideDrawer;
