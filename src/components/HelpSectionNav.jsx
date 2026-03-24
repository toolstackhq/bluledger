import { NavLink } from "react-router-dom";
import { HELP_SECTION_ITEMS } from "../navigation/helpNav";

function HelpSectionNav() {
  return (
    <nav className="help-section-nav" aria-label="Help topics" data-testid="help-section-nav">
      <ul className="help-section-nav__list">
        {HELP_SECTION_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HelpSectionNav;
