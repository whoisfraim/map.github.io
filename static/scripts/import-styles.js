const importStyles = (href) => {
  const linkTag = document.createElement('link');
  linkTag.href = href;
  linkTag.rel = 'stylesheet';
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(linkTag);
};

const styles = [
  'static/styles/leaflet.css',
  'static/styles/material.css',
  'static/styles/dialog-polyfill.css',
  'static/styles/common.min.css',
];

styles.forEach(importStyles);
