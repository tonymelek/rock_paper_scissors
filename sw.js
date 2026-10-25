// Bump CACHE when a precached file changes so the next visit drops the old copy.
const CACHE = "rps-v4";

const PRECACHE = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/game.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./images/logo.png",
  "./images/rock.png",
  "./images/paper.png",
  "./images/scissors.png",
  "./images/r.png",
  "./images/p.png",
  "./images/s.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (isShellAsset(url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheThenRefresh(event, request));
});

function isShellAsset(url) {
  return /\.(js|css|html|webmanifest)$/i.test(url.pathname);
}

async function networkFirst(request, fallback) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(fallback ?? request, response.clone());
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (fallback ? await cache.match(fallback) : undefined) ||
      new Response("Offline", { status: 503, statusText: "Offline" })
    );
  }
}

async function cacheThenRefresh(event, request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    event.waitUntil(refresh.then(() => undefined));
    return cached;
  }

  const response = await refresh;
  if (response) return response;
  return new Response("Offline", { status: 503, statusText: "Offline" });
}
