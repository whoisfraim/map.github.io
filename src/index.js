// styles
import 'leaflet/dist/leaflet.css';
import 'dialog-polyfill/dist/dialog-polyfill.css';
import 'material-design-lite/dist/material.blue-indigo.min.css';
import './index.css';

import 'material-design-lite/material.min';

import { initMap } from '@/map';
import { initDOM } from '@/dom';

import state from '@/state';

window.addEventListener('load', async () => {
  try {
    if (navigator.serviceWorker) {
      await navigator.serviceWorker.register('/sw.js')
      console.log('Service worker register success');
    }
  } catch (e) {
    console.log('Service worker register fail', e);
  }

  state.appLoading = false;
  initMap();
  initDOM();
});
