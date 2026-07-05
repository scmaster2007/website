
(function () {
  var CODE = 'sungwoo'; 
  if (!CODE) return;

  window.goatcounter = {
    endpoint: 'https://' + CODE + '.goatcounter.com/count',
    path: location.pathname + location.search,
  };

  // Version-pinned + subresource integrity: the browser refuses to run the
  // script if its contents ever differ from this hash (CDN compromise guard).
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.v5.js';
  s.integrity = 'sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ';
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
})();
