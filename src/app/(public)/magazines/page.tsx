import type { Metadata } from "next";
import ComingSoon from "@/components/layout/ComingSoon";
import CoverPlates from "@/components/magazines/CoverPlates";

export const metadata: Metadata = {
  title: "Magazines",
  description:
    "The SPX6900 print magazine is on its way. The print edition is coming soon — in the meantime, read the digital SPX Magazine.",
};

export default function MagazinesPage() {
  return (
    <>
      <ComingSoon
        section="Magazines"
        headline="The print edition"
        tagline="is coming Soon"
        note="We're pressing something special: the SPX6900 print magazine. In the meantime, the digital edition is already live."
        cta={{ label: "Read the digital edition", href: "/articles/magazine" }}
      />
      <CoverPlates />
    </>
  );
}
