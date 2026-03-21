import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import { useAppContext } from "../context/AppContext";

function NotFoundPage() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-panel-wrap">
          <div className="login-panel">
            <h1>Page not found</h1>
            <p>
              The page you requested is unavailable. Return to <Link id="not-found-sign-in-link" to="/login">sign in</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="page-stack">
        <PageHeader title="Page not found" subtitle="The requested page could not be located." />
        <SectionPanel>
          <Link id="not-found-dashboard-link" to="/dashboard">Back to Account Summary</Link>
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default NotFoundPage;
