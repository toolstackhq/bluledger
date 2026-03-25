import { useEffect, useState } from "react";
import AutomationGuideDrawer from "./AutomationGuideDrawer";

const AUTOMATION_GUIDE_DISMISSED_KEY = "bluledger-automation-guide-dismissed-v1";

function isGuideDismissedForSession() {
  return window.sessionStorage.getItem(AUTOMATION_GUIDE_DISMISSED_KEY) === "true";
}

function dismissGuideForSession() {
  window.sessionStorage.setItem(AUTOMATION_GUIDE_DISMISSED_KEY, "true");
}

function AutomationGuideWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(isGuideDismissedForSession());
  }, []);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleMinimize() {
    setIsOpen(false);
  }

  function handleDismiss() {
    dismissGuideForSession();
    setIsOpen(false);
    setIsDismissed(true);
  }

  if (isDismissed) {
    return null;
  }

  return (
    <div className="automation-guide-widget" data-testid="automation-guide-widget">
      {isOpen ? (
        <div className="automation-guide-anchor" id="automation-guide-drawer">
          <AutomationGuideDrawer
            onClose={handleDismiss}
            onMinimize={handleMinimize}
          />
        </div>
      ) : (
        <button
          type="button"
          className="automation-guide-launcher"
          data-testid="automation-guide-launcher"
          onClick={handleOpen}
          aria-label="Open automation guide"
        >
          <span className="automation-guide-launcher__eyebrow">Help</span>
          <strong>Automation Guide</strong>
        </button>
      )}
    </div>
  );
}

export default AutomationGuideWidget;
