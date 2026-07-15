import type { Metadata } from "next";
import PodcastShowcase from "@/components/podcasts/PodcastShowcase";

export const metadata: Metadata = {
  title: "Podcasts",
  description:
    "SPX6900 on air: the community's podcasts, X Spaces, and weekly shows. Flip The Stock Market, Big6900 Spaces recordings, and Persist Forever. Tune in and believe out loud.",
};

export default function PodcastsPage() {
  return <PodcastShowcase />;
}
