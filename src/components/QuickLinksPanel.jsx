import { Link } from "react-router-dom";
import SectionPanel from "./SectionPanel";

function toTestId(item) {
  if (item.route === "/transfers") {
    return "quick-link-transfer";
  }

  return `quick-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
}

function QuickLinksPanel({ links }) {
  return (
    <SectionPanel
      title="Quick Links"
      subtitle="Common tasks and servicing actions"
    >
      <ul className="quick-links">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              id={`quick-link-${link.id}`}
              to={link.route}
              data-testid={toTestId(link)}
              className="quick-link-card"
            >
              <span className="quick-link-card__label">{link.label}</span>
              <span className="quick-link-card__arrow" aria-hidden="true">
                ›
              </span>
            </Link>
            <div className="table-subline">{link.description}</div>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export default QuickLinksPanel;
