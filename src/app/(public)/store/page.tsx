import type { Metadata } from "next";
import StoreShowcase from "@/components/store/StoreShowcase";

export const metadata: Metadata = {
  title: "Store",
  description:
    "The SPX6900 store directory: shop official ateliers (SPX6900 Industries, SPX6900 Gear), Solana streetwear from LilMissPonzi, and watch for Jinping Labs. Gear up for the flippening.",
};

export default function StorePage() {
  return <StoreShowcase />;
}
