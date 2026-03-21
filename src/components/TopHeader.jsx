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
          <span>Last login: {user.lastLogin}</span>
          <a href={`tel:${appMeta.helpPhone.replace(/\s+/g, "")}`}>Help {appMeta.helpPhone}</a>
          <span>
            {user.preferredName} {user.lastName}
          </span>
          <button
            type="button"
            className="utility-link"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
