import type { Metadata } from "next";
import PodcastShowcase from "@/components/podcasts/PodcastShowcase";

export const metadata: Metadata = {
  title: "Podcasts",
  description:
    "SPX6900 on air: the community's podcasts, X Spaces, live shows, and weekly recaps. Flip The Stock Market, Big6900 Spaces recordings, Persist Forever, Aeons Online every Thursday, and SPX_FM live from SPX Studios on Twitch. Tune in and believe out loud.",
};

export default function PodcastsPage() {
  return <PodcastShowcase />;
}
