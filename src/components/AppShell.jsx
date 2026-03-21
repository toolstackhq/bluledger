import TopHeader from "./TopHeader";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import UtilityPanel from "./UtilityPanel";
import ToastMessage from "./ToastMessage";
import { useAppContext } from "../context/AppContext";

function AppShell({ children, railContent }) {
  const { toast, dismissToast, utilityPanel } = useAppContext();

  return (
    <div className="app-shell">
      <TopHeader />
      <TopNav />
      <div className="app-shell__inner">
        <div className="app-shell__body">
          <SideNav />
          <main className="app-shell__main">{children}</main>
          <aside className="app-shell__rail">
            {railContent || <UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}
          </aside>
        </div>
      </div>
      {toast ? <ToastMessage toast={toast} onClose={dismissToast} /> : null}
    </div>
  );
}

export default AppShell;
