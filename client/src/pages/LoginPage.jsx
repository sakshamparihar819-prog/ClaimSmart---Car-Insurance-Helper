import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormField from "../components/auth/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/calculator";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-14 sm:py-20">
      <div className="rounded-lg border-2 border-black bg-white p-7">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-black/55">Log in to see your saved checks.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField
            label="Email"
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Password"
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="rounded-md border-2 border-black bg-orange-50 px-3 py-2 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-black px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-black disabled:opacity-50"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-black/55">
          New here?{" "}
          <Link to="/register" className="font-bold text-black underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
