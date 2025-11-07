// Service worker with versioned cache and update flow
const CACHE = "avafit12-cache-v2"; // bump this when deploying new assets
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e)=>{
  e.waitUntil(
    (async ()=>{
      const keys = await caches.keys();
      await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
      await self.clients.claim();
    })()
  );
});
self.addEventListener("message", (e)=>{
  if(e.data && e.data.type === "SKIP_WAITING"){
    self.skipWaiting();
  }
});
self.addEventListener("fetch", (e)=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request))
  );
});
