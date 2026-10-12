import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormField from "../components/auth/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/calculator" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/calculator", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-14 sm:py-20">
      <div className="rounded-lg border-2 border-black bg-white p-7">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-black/55">Free. Every check you run gets saved to your history.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField
            label="Name"
            id="name"
            type="text"
            autoComplete="name"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            label="Password (min 6 characters)"
            id="password"
            type="password"
            autoComplete="new-password"
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
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-black/55">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-black underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
