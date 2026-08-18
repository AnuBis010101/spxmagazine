import type { Metadata } from "next";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import ProjectAeon from "@/components/learn/ProjectAeon";

const DESCRIPTION =
  "Project AEON: 3,333 generative beings on Ethereum, born from a fictional quantum glitch inside SPX6900 Labs. The lore, the artwork, and how the collection ties into the SPX6900 movement.";

export const metadata: Metadata = {
  title: "Project AEON",
  description: DESCRIPTION,
  alternates: { canonical: "/learn/project-aeon" },
  openGraph: {
    title: "Project AEON",
    description: DESCRIPTION,
    images: [
      {
        url: buildOgImageUrl({
          title: "Project AEON",
          subtitle: "3,333 beings born from a quantum glitch",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function ProjectAeonPage() {
  return <ProjectAeon />;
}
