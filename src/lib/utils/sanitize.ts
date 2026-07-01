import DOMPurify from "isomorphic-dompurify";

// Embeds are only permitted from these hosts.
const ALLOWED_IFRAME_HOSTS =
  /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

let hookRegistered = false;
function ensureHook() {
  if (hookRegistered) return;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const el = node as Element;
      const src = el.getAttribute?.("src") ?? "";
      if (!ALLOWED_IFRAME_HOSTS.test(src)) {
        el.remove?.();
      }
    }
  });
  hookRegistered = true;
}

/**
 * Sanitize stored article HTML before rendering with dangerouslySetInnerHTML.
 * Strips scripts, event handlers, and dangerous URL schemes (javascript:, data:)
 * while preserving the tags TipTap produces and youtube/vimeo embeds.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  ensureHook();
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "target", "rel"],
  });
}
