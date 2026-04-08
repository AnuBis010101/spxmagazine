import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Image
        src="/spxlogo.png"
        alt="SPX6900 Logo"
        width={80}
        height={80}
        className="opacity-60"
      />
      <h1 className="font-display text-5xl font-bold text-white mt-8">404</h1>
      <p className="text-mag-muted text-lg mt-3">Page Not Found</p>
      <p className="text-mag-muted text-sm mt-1 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 bg-gold-400 text-mag-black px-8 py-3 rounded-full font-semibold hover:bg-gold-500 transition"
      >
        Go Home
      </Link>
    </section>
  );
}
