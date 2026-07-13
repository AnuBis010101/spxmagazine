import type { Metadata } from "next";
import ComingSoon from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Store",
  description:
    "The SPX6900 store is on its way. Merch and more are coming soon — gear up for the flippening.",
};

export default function StorePage() {
  return (
    <ComingSoon
      section="Store"
      headline="Coming"
      tagline="Soon"
      note="The SPX6900 store is being stocked with merch and more. Gear up for the flippening — stay tuned."
      cta={{ label: "Back to home", href: "/" }}
    />
  );
}
