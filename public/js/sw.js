var cacheName = 'mycaps-v1';

/**
 * Caching fetched resources
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
 *
 * Online first for html, js, css; cache is used as fallback
 * Offline first for images
 */
self.addEventListener('fetch', (e) => {
  if (! e.request.url.includes('/images/')) {
    fetch(e.request)
      .then((response) => {
        console.log(`ONLINE FIRST - Using online resource ${e.request.url}`)
        return caches.open(cacheName).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        console.log(`ONLINE FIRST - Using cached resource as fallback ${e.request.url}`)
        return caches.match(e.request)
      })
  } else {
    e.respondWith(
      caches.match(e.request).then((r) => {
        if (r) {
          console.log(`OFFLINE FIRST - Using cached resource ${e.request.url}`)
          return r
        } else {
          console.log(`OFFLINE FIRST - Fetch resource ${e.request.url}`)
          return fetch(e.request).then((response) => {
            return caches.open(cacheName).then((cache) => {
              cache.put(e.request, response.clone());
              return response;
            });
          })
        }
      })
    );
  }
});
