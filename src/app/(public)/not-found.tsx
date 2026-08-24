import Link from "next/link";
import AeonPlate from "@/components/aeon/AeonPlate";
import { AEON_REFERENCE } from "@/lib/aeon";

/* A dead end is a moment of failure. A framed portrait, a quiet caption and a
   way onward turn it into a small gift — and this is the one place in the
   chrome where the artwork is shown properly, which is what makes the
   restraint everywhere else read as deliberate rather than timid. */

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-16">
      <div className="grid w-full grid-cols-1 items-center gap-10 sm:gap-14 md:grid-cols-[minmax(0,280px)_1fr]">
        <AeonPlate id={AEON_REFERENCE} />

        <div className="text-center md:text-left">
          <h1 className="font-display text-5xl font-bold text-white sm:text-6xl">404</h1>
          <p className="mt-3 text-lg text-mag-muted">Page Not Found</p>
          <p className="mt-2 max-w-md text-sm text-mag-muted">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-gold-400 px-8 py-3 font-semibold text-mag-black transition hover:bg-gold-500"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
