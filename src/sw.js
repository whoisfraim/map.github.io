const staticCacheName = 'map-cache'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName)
      // .then(cache => cache.addAll[])
  )
})

self.addEventListener('activate', e => {
  console.log('activate');
})
