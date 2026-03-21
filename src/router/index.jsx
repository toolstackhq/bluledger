import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TransferPage from "../pages/TransferPage";
import TransferReviewPage from "../pages/TransferReviewPage";
import CardsPage from "../pages/CardsPage";
import ProfilePage from "../pages/ProfilePage";
import TransactionsPage from "../pages/TransactionsPage";
import StatementsPage from "../pages/StatementsPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicLoginRoute() {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
}

function HomeRedirect() {
  const { isAuthenticated } = useAppContext();

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<PublicLoginRoute />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfers"
        element={
          <ProtectedRoute>
            <TransferPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfers/review"
        element={
          <ProtectedRoute>
            <TransferReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cards"
        element={
          <ProtectedRoute>
            <CardsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statements"
        element={
          <ProtectedRoute>
            <StatementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
