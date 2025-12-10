import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-ink-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export default NotFound;
