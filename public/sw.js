const CACHE='personal-life-os-v1720';
const BASE=self.registration.scope;
const APP_SHELL=[BASE,`${BASE}manifest.webmanifest`,`${BASE}icons/app-icon.svg`];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key.startsWith('personal-life-os-')&&key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
));

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)))}
    return response;
  }).catch(async()=>{
    const cached=await caches.match(request,{ignoreSearch:request.mode==='navigate'});
    if(cached)return cached;
    if(request.mode==='navigate')return caches.match(BASE);
    return Response.error();
  }));
});
