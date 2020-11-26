const FILES_TO_CACHE = [
    '/',
    '/styles.css',
    '/index.html',
    '/index.js',
    '/db.js',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ];
  
  const STATIC_CACHE = "static-cache-v2";
  const DATA_CACHE = "data-cache-v1";
  //---install
  self.addEventListener("install",(event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  });
  //---activate
  self.addEventListener("activate",(event) => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DATA_CACHE) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
  });
  //---fetch
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((r) => {
            console.log("Service Worker Fetching resource: "+event.request.url);
        return r || fetch(event.request).then((response) => {
                  return caches.open(STATIC_CACHE).then((cache) => {
            console.log("Service Worker Caching new resource: "+event.request.url);
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });