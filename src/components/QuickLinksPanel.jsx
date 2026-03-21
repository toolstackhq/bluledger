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
    <SectionPanel title="Quick Links">
      <ul className="quick-links">
        {links.map((link) => (
          <li key={link.id}>
            <Link to={link.route} data-testid={toTestId(link)}>
              {link.label}
            </Link>
            <div className="table-subline">{link.description}</div>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export default QuickLinksPanel;
