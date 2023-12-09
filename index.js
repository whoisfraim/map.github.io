import state from './state.js';

window.addEventListener('load', async () => {
  state.appLoading = false;
  (await import('./utils/map.js')).initMap();
  (await import('./utils/dom.js')).initDOM();
});
