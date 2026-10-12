import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const linkClass = "text-sm font-medium text-black/70 hover:text-black";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  function handleLogout() {
    logout();
    close();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#F7F3EA]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-black bg-orange-400 text-sm font-bold">
            CS
          </span>
          <span className="text-lg font-bold tracking-tight">ClaimSmart</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/#how-it-works" className={linkClass}>
            How it works
          </Link>
          <Link to="/#features" className={linkClass}>
            Features
          </Link>
          <Link to="/calculator" className={linkClass}>
            Calculator
          </Link>
          {user ? (
            <>
              <Link to="/history" className={linkClass}>
                My history
              </Link>
              <span className="text-sm text-black/50">Hi, {user.name.split(" ")[0]}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border-2 border-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md border-2 border-black bg-black px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-black"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t-2 border-black px-5 py-4 md:hidden">
          <Link to="/#how-it-works" className="px-2 py-2.5 text-sm font-medium" onClick={close}>
            How it works
          </Link>
          <Link to="/#features" className="px-2 py-2.5 text-sm font-medium" onClick={close}>
            Features
          </Link>
          <Link to="/calculator" className="px-2 py-2.5 text-sm font-medium" onClick={close}>
            Calculator
          </Link>
          {user ? (
            <>
              <Link to="/history" className="px-2 py-2.5 text-sm font-medium" onClick={close}>
                My history
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-md border-2 border-black px-4 py-2.5 text-center text-sm font-bold"
              >
                Log out ({user.name.split(" ")[0]})
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-2 py-2.5 text-sm font-medium" onClick={close}>
                Log in
              </Link>
              <Link
                to="/register"
                className="mt-2 rounded-md border-2 border-black bg-black px-4 py-2.5 text-center text-sm font-bold text-white"
                onClick={close}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
