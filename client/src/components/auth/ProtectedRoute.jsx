import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/** Wrap a page in this to require login. Logged-out visitors are sent to /login, then back here afterwards. */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="px-5 py-20 text-center text-sm text-black/50">Checking your session…</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
