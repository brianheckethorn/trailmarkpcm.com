/* Local document language selection only; no network, storage or app state. */
(function () {
  'use strict';
  var lang = new URLSearchParams(window.location.search).get('lang') === 'es' ? 'es' : 'en';
  document.documentElement.lang = lang;
  document.title = lang === 'es' ? 'Ayuda y preguntas frecuentes · TrailMark PCM' : 'Help & FAQ · TrailMark PCM';
  document.querySelectorAll('[data-language-panel]').forEach(function (panel) {
    panel.hidden = panel.getAttribute('data-language-panel') !== lang;
  });
  document.querySelectorAll('[data-language-link]').forEach(function (link) {
    if (link.getAttribute('data-language-link') === lang) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}());
