import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="text-5xl font-bold">404</p>
      <p className="mt-3 text-sm text-black/55">That page doesn&apos;t exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md border-2 border-black bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-black"
      >
        Back to home
      </Link>
    </div>
  );
}
