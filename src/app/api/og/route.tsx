import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "SPX Magazine";
  const author = searchParams.get("author");
  const category = searchParams.get("category");
  const subtitle = searchParams.get("subtitle");

  const [interFont, spaceGroteskFont] = await Promise.all([
    fetch(new URL("./fonts/Inter-Bold.ttf", import.meta.url)).then((r) =>
      r.arrayBuffer()
    ),
    fetch(new URL("./fonts/SpaceGrotesk-Bold.ttf", import.meta.url)).then(
      (r) => r.arrayBuffer()
    ),
  ]);

  const titleSize = title.length > 100 ? 32 : title.length > 60 ? 40 : 52;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0A0A0A",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Top gold accent bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #D4AF37, #B8960C, #D4AF37)",
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 70px",
          }}
        >
          {/* Category pill */}
          {category && (
            <div
              style={{
                display: "flex",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#0A0A0A",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "Inter",
                  padding: "6px 16px",
                  borderRadius: "100px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "flex",
                }}
              >
                {category}
              </div>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              color: "#FFFFFF",
              lineHeight: 1.2,
              display: "flex",
              maxWidth: "900px",
            }}
          >
            {title.length > 120 ? title.slice(0, 117) + "..." : title}
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: "80px",
              height: "3px",
              backgroundColor: "#D4AF37",
              marginTop: "28px",
              borderRadius: "2px",
              display: "flex",
            }}
          />

          {/* Author */}
          {author && (
            <div
              style={{
                fontSize: "20px",
                color: "#9CA3AF",
                marginTop: "20px",
                fontFamily: "Inter",
                display: "flex",
              }}
            >
              By {author}
            </div>
          )}

          {/* Subtitle (for listing pages) */}
          {subtitle && !author && (
            <div
              style={{
                fontSize: "20px",
                color: "#9CA3AF",
                marginTop: "20px",
                fontFamily: "Inter",
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom bar with branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 70px 0 70px",
            height: "80px",
            borderTop: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              color: "#D4AF37",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            SPX Magazine
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#6B7280",
              fontFamily: "Inter",
              display: "flex",
            }}
          >
            The Voice of SPX6900
          </div>
        </div>

        {/* Bottom gold accent bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #D4AF37, #B8960C, #D4AF37)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interFont,
          style: "normal",
          weight: 700,
        },
        {
          name: "Space Grotesk",
          data: spaceGroteskFont,
          style: "normal",
          weight: 700,
        },
      ],
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
