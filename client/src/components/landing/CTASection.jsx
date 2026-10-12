import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CTASection() {
  const { user } = useAuth();

  return (
    <section className="px-5 pb-20">
      <div className="mx-auto max-w-4xl rounded-lg border-2 border-black bg-white px-8 py-12 text-center sm:px-14">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Got a dent staring at you right now?</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-black/60 sm:text-base">
          Two minutes and a few numbers is all ClaimSmart needs to tell you what it&apos;ll actually cost you
          either way.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-orange-400 px-7 py-3 text-sm font-bold hover:bg-orange-300"
          >
            Open the calculator
            <ArrowRight size={16} />
          </Link>
          {!user && (
            <Link
              to="/register"
              className="rounded-md border-2 border-black px-7 py-3 text-sm font-bold hover:bg-black hover:text-white"
            >
              Create free account
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
