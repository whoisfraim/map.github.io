import '../static/scripts/import-styles';
import '../static/scripts/leaflet';
import '../static/scripts/dialog-polyfill';
import '../static/scripts/material';

import { initMap } from './map';
import { initDOM } from './dom';

import state from './state';

window.addEventListener('load', async () => {
  state.appLoading = false;
  initMap();
  initDOM();
});
