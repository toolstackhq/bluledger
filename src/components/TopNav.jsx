import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getAppNavItems } from "../navigation/appNav";

function TopNav() {
  const { featureFlags } = useAppContext();
  const navItems = getAppNavItems(featureFlags.helpCenterEnabled);

  return (
    <nav className="top-nav" aria-label="Primary">
      <div className="top-nav__inner">
        <ul className="top-nav__list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink id={`top-nav-${item.to.replace("/", "") || "home"}`} to={item.to}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default TopNav;
