import AppShell from "./AppShell";
import HelpSectionNav from "./HelpSectionNav";
import PageHeader from "./PageHeader";
import SectionPanel from "./SectionPanel";
import { useAppContext } from "../context/AppContext";
import { trackEvent } from "../lib/analytics";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function HelpLayout({ title, subtitle, children }) {
  const { appMeta } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    trackEvent("help_opened", {
      help_page: location.pathname.replace("/help/", "") || "help",
    });
  }, [location.pathname]);

  const helpRail = (
    <div className="page-stack">
      <SectionPanel title="Support Channels">
        <ul className="utility-list">
          <li>
            <span className="utility-label">Call</span>
            <div>{appMeta.helpPhone}</div>
          </li>
          <li>
            <span className="utility-label">Hours</span>
            <div>{appMeta.supportHours}</div>
          </li>
          <li>
            <span className="utility-label">Environment</span>
            <div>Training-ready workflows for automation practice</div>
          </li>
        </ul>
      </SectionPanel>
      <SectionPanel title="What To Expect">
        <div className="form-grid">
          <div className="form-hint">
            Help workflows are intentionally rich in frames, embedded widgets, and realistic
            support tasks.
          </div>
          <div className="form-hint">{appMeta.securityNotice}</div>
        </div>
      </SectionPanel>
    </div>
  );

  return (
    <AppShell railContent={helpRail}>
      <div className="page-stack">
        <PageHeader eyebrow="Help Centre" title={title} subtitle={subtitle} />
        <SectionPanel
          title="Help Topics"
          subtitle="Choose the support workflow you want to practise."
          testId="help-nav-panel"
        >
          <HelpSectionNav />
        </SectionPanel>
        {children}
      </div>
    </AppShell>
  );
}

export default HelpLayout;
