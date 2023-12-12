// styles
import 'leaflet/dist/leaflet.css';
import 'dialog-polyfill/dist/dialog-polyfill.css';
import 'material-design-lite/dist/material.blue-indigo.min.css';
import './index.css';

import 'material-design-lite/material.min';

import { initMap } from '@/map';
import { initDOM } from '@/dom';

import state from '@/state';

window.addEventListener('load', () => {
  state.appLoading = false;
  initMap();
  initDOM();
});
