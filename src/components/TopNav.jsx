import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Accounts", to: "/dashboard" },
  { label: "Payments", to: "/transfers" },
  { label: "Transactions", to: "/transactions" },
  { label: "Statements", to: "/statements" },
  { label: "Cards", to: "/cards" },
  { label: "Profile", to: "/profile" },
  { label: "Settings", to: "/settings" },
];

function TopNav() {
  return (
    <nav className="top-nav" aria-label="Primary">
      <div className="top-nav__inner">
        <ul className="top-nav__list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default TopNav;
