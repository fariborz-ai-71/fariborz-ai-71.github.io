const CACHE = "fo-portfolio-v3";
const ASSETS = [
  "/index.html",
  "/styles.css",
  "/script.js",
  "/assets/projects.json",
  "/assets/avatar.png",
  "/assets/cover.png",
  "/assets/resume.pdf",
  "/assets/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Ensure navigation requests always get a page
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((r) => r || fetch(req))
  );
});