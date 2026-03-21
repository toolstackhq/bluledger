import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const sideNavItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transfer Money", to: "/transfers" },
  { label: "Transactions", to: "/transactions" },
  { label: "Statements", to: "/statements" },
  { label: "Cards", to: "/cards" },
  { label: "Profile", to: "/profile" },
  { label: "Settings", to: "/settings" },
];

function SideNav() {
  const { logout } = useAppContext();
  const navigate = useNavigate();

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
