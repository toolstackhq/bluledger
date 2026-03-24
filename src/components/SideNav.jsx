import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getAppNavItems } from "../navigation/appNav";

function SideNav() {
  const { featureFlags, logout } = useAppContext();
  const navigate = useNavigate();
  const sideNavItems = getAppNavItems(featureFlags.helpCenterEnabled).map((item) => ({
    ...item,
    label: item.label === "Accounts" ? "Dashboard" : item.label === "Payments" ? "Transfer Money" : item.label,
  }));

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="side-nav" aria-label="Section navigation">
      <ul className="side-nav__list">
        {sideNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              id={`side-nav-${item.to.replace("/", "") || "home"}`}
              to={item.to}
              end={item.to === "/dashboard"}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
        <li>
          <button id="side-nav-logout-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default SideNav;
