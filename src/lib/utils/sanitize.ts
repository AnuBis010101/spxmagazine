import sanitizeHtmlLib from "sanitize-html";

/**
 * Sanitize stored article HTML before rendering with dangerouslySetInnerHTML.
 *
 * Uses sanitize-html (pure JS, htmlparser2) rather than DOMPurify/jsdom so it
 * runs reliably in serverless/edge Node runtimes. Strips scripts, event
 * handlers, and dangerous URL schemes while preserving the tags TipTap produces
 * and youtube/vimeo embeds.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  return sanitizeHtmlLib(html, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "figure",
      "figcaption",
      "iframe",
      "span",
      "u",
      "s",
    ]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      iframe: [
        "src",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
      ],
      "*": ["class", "style", "data-youtube-video"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "youtube-nocookie.com",
      "player.vimeo.com",
    ],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer" },
      }),
    },
  });
}
