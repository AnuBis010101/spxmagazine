import type { Metadata } from "next";
import BookShowcase from "@/components/books/BookShowcase";

export const metadata: Metadata = {
  title: "Books",
  description:
    "The SPX6900 library — the essential reading on the pure belief asset. Amazon paperbacks (Stop Trading, Start Believing!; Invest & Grow Rich), free e-books (Discovering SPX6900; Alchemical), and an audiobook, all written by the community.",
};

export default function BooksPage() {
  return <BookShowcase />;
}
