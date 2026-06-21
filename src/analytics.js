
(function () {
  var CODE = 'sungwoo'; 
  if (!CODE) return;

  window.goatcounter = {
    endpoint: 'https://' + CODE + '.goatcounter.com/count',
    path: location.pathname + location.search,
  };

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(s);
})();
