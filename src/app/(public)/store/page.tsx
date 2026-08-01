import type { Metadata } from "next";
import StoreShowcase from "@/components/store/StoreShowcase";

export const metadata: Metadata = {
  title: "Store",
  description:
    "The SPX6900 store directory: shop the official stores (SPX6900 Industries, SPX6900 Gear), Solana streetwear from LilMissPonzi, and Tokyo-coded apparel from Jinping Labs. Gear up for the flippening.",
};

export default function StorePage() {
  return <StoreShowcase />;
}
