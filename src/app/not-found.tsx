import NotFound from "./(public)/not-found";

/* Next only routes unmatched URLs to a ROOT not-found. Without this file the
   designed 404 inside the (public) group never renders for a typo'd path —
   the framework's built-in plain-text 404 does. */
export default NotFound;
