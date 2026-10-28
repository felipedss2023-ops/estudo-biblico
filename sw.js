// Service worker do Estudo Bíblico. Ao publicar uma nova versão do index.html, aumente o número em V.
var V='estudo-v25',SHELL=['./','index.html','config.js','manifest.json','icon-192.png','icon-512.png','biblia-jfaal.json','biblia-jfaal-creditos.txt'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==V}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);if(u.hostname.indexOf('supabase')>-1)return;
  var app=r.mode==='navigate'||/(\.html|config\.js|\/)$/.test(u.pathname);
  if(app){ // rede primeiro (pega atualizações); sem internet, usa o que está guardado
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res})
      .catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}));return}
  // demais arquivos (fontes, jsPDF, ícones): guardados na primeira vez
  e.respondWith(caches.match(r).then(function(m){
    var net=fetch(r).then(function(res){if(res&&(res.status===200||res.type==='opaque')){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res}).catch(function(){return m});
    return m||net}))});
