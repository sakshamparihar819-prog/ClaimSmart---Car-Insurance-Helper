import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#F7F3EA]">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-orange-400 text-xs font-bold">
                CS
              </span>
              <span className="text-base font-bold tracking-tight">ClaimSmart</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-black/60">
              A decision-support tool for Indian car owners, built on IRDAI No-Claim Bonus rules. Repair
              costs shown are illustrative estimates — always confirm with your insurer or garage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-black/40">Product</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link to="/#how-it-works" className="text-black/70 hover:text-black">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link to="/#features" className="text-black/70 hover:text-black">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/calculator" className="text-black/70 hover:text-black">
                    Calculator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-black/40">Built by</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="text-black/70">Your Name Here</li>
                <li>
                  <a
                    href="https://github.com/your-username"
                    className="inline-flex items-center gap-1.5 text-black/70 hover:text-black"
                  >
                    <Github size={14} /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/your-username"
                    className="inline-flex items-center gap-1.5 text-black/70 hover:text-black"
                  >
                    <Linkedin size={14} /> LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-3 border-t border-black/15 pt-5 sm:flex-row sm:items-center">
          <p className="text-xs text-black/40">© {new Date().getFullYear()} ClaimSmart. Not an insurer.</p>
          <p className="text-xs text-black/40">Made for Indian roads 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
