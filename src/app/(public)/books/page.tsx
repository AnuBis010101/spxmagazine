import type { Metadata } from "next";
import ComingSoon from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Books",
  description:
    "The SPX6900 bookshelf is on its way. Books are coming soon — the definitive reading list for the Cognisphere.",
};

export default function BooksPage() {
  return (
    <ComingSoon
      section="Books"
      headline="Coming"
      tagline="Soon"
      note="The SPX6900 bookshelf is being written: the essential reading for Aeons. Check back soon."
      cta={{ label: "Start with the guides", href: "/learn" }}
    />
  );
}
