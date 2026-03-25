import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import AnalyticsTracker from "./components/AnalyticsTracker";
import AutomationGuideWidget from "./components/AutomationGuideWidget";
import LoadingOverlay from "./components/LoadingOverlay";
import RouteDelayController from "./components/RouteDelayController";
import { AppProvider } from "./context/AppContext";
import { useAppContext } from "./context/AppContext";

function AppContents() {
  const { loadingOverlay, performanceConfig } = useAppContext();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AnalyticsTracker />
      <RouteDelayController />
      <AppRouter />
      <AutomationGuideWidget />
      {loadingOverlay.visible ? (
        <LoadingOverlay message={loadingOverlay.message} mode={performanceConfig.mode} />
      ) : null}
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContents />
    </AppProvider>
  );
}

export default App;
