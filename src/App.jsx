import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
