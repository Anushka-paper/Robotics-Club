let done = false;

/** Warm the lazy game route so navigation from the landing page is instant. */
export function prefetchPlay() {
  if (done) return;
  done = true;
  void import("../routes/Play/PlayPage");
}
