import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AnalyticsTracker />
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
