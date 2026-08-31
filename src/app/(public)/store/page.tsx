import type { Metadata } from "next";
import StoreShowcase from "@/components/store/StoreShowcase";

export const metadata: Metadata = {
  title: "Store",
  description:
    "The SPX6900 store directory: the official SPX6900 Industries store, plus community storefronts from SPX6900 Gear and Jinping Labs. Gear up for the flippening.",
};

export default function StorePage() {
  return <StoreShowcase />;
}
