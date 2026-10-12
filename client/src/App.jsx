import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import HistoryDetailPage from "./pages/HistoryDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/:id"
          element={
            <ProtectedRoute>
              <HistoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
