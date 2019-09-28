//!minOnSave
const staticCache = "staticCache-v2";
const cacheAssets = [
  "./",
  "./index.html",
  "./app.js",
  "./styles/style.min.css",
  "./images/logo.svg",
  "./images/bg-deco.svg",
  "./images/footer.svg",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./manifest.json",
  "https://fonts.googleapis.com/css?family=Poppins:300,400,500&display=swap"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(staticCache).then(cache => {
      cache.addAll(cacheAssets);
    })
  )
})

self.addEventListener("activate", ev => {
  console.log("Service Worker activated");
  ev.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== staticCache)
        .map(key => caches.delete(key))
      );
    })
  )
})

self.addEventListener("fetch", ev => {
  ev.respondWith(
    caches.match(ev.request).then(cacheResp => {
      return cacheResp ||
        fetch(ev.request).then(fetchResp => {
          return fetchResp;
        });
    })
    .catch(err => console.error(err))
  )
})
