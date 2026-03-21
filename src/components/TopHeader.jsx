import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BrandLockup from "./BrandLockup";

function TopHeader() {
  const { appMeta, user, logout } = useAppContext();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="top-header">
      <div className="top-header__inner">
        <BrandLockup inverted subtitle={appMeta.subtitle} />
        <div className="top-header__actions">
          <span id="last-login-status" aria-label={`Last login ${user.lastLogin}`}>
            Last login: {user.lastLogin}
          </span>
          <a id="help-phone-link" href={`tel:${appMeta.helpPhone.replace(/\s+/g, "")}`}>
            Help {appMeta.helpPhone}
          </a>
          <span id="active-customer-name" aria-label={`Signed in as ${user.preferredName} ${user.lastName}`}>
            {user.preferredName} {user.lastName}
          </span>
          <button
            id="header-logout-button"
            type="button"
            className="utility-link"
            onClick={handleLogout}
            data-testid="logout-button"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
