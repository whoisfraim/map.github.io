import state from '../state.js';

import { debounce } from './utils.js';
import { changeGeolocationButtonDataEnabled } from './dom.js';
import { getSuggestions } from './api.js';

export const initMap = () => {
  if (state.appLoading) return;

  const { map, layers, geolocationLayers } = state;

  const storageLayerKey = localStorage.getItem('data-layer');
  map.addLayer(layers[storageLayerKey || layers.$2gis]);

  map.on('locationfound', ({ latlng }) => {
    if (state.geolocationIsFirstLocation) {
      map.setView(latlng, 20);
      state.geolocationIsFirstLocation = false;
    }

    if (geolocationLayers.me || geolocationLayers.radius) {
      map.removeLayer(geolocationLayers.me);
      map.removeLayer(geolocationLayers.radius);
    }

    geolocationLayers.me = getMeRadiusMarker(latlng).addTo(map);
    geolocationLayers.radius = getMeMarker(latlng).addTo(map);
  });

  map.on('locationerror', () => {
    if (state.geolocationIsEnabled) {
      alert('Не удалось получить геолокацию!');
      toggleGeolocation();
    }
  })
};

export const switchMapLayer = (condition) => {
  const { map, layers } = state;

  switch (condition) {
    case '$2gis':
      map.removeLayer(layers.$google);
      map.addLayer(layers.$2gis);
      break;
    case '$google':
      map.removeLayer(layers.$2gis);
      map.addLayer(layers.$google);
      break;
  }
};

export const disableGeolocation = () => {
  state.map.stopLocate();
  changeGeolocationButtonDataEnabled(false);
  state.geolocationIsEnabled = false;
}

export const toggleGeolocation = (watch = false) => {
  if (state.geolocationIsEnabled) {
    return disableGeolocation()
  }

  if (watch) {
    changeGeolocationButtonDataEnabled(true);
    state.geolocationIsEnabled = true;
  }
  state.geolocationIsFirstLocation = true;
  state.map.locate({ watch, timeout: 5000, enableHighAccuracy: true });
};

export const requestGeocodeByQuery = debounce((
  query,
  requestCallback,
  successCallback,
  errorCallback,
  finallyCallback,
) => {
  const { lat, lng } = state.map.getCenter();

  const searchParams = {
    q: query,
    lat: lat,
    lon: lng,
    limit: 5,
  };

  if (!state.searchLoading) {
    getSuggestions(searchParams, requestCallback, successCallback, errorCallback, finallyCallback);
  }
}, 1000);

export const setView = (position, zoom) => state.map.setView(position, zoom, { animate: true });

export const clearActiveMarker = () => {
  if (state.activeMarker === null) return;

  state.map.removeLayer(state.activeMarker);
  state.activeMarker.off();
  state.activeMarker = null;
}

export const setActiveMarker = (position, title) => {
  disableGeolocation();
  clearActiveMarker();
  state.activeMarker = L.marker(position, { icon: state.icons.primary }).addTo(state.map).bindPopup(title);
  state.activeMarker.on('click', state.activeMarker.toggleTooltip);
  setView(position, 20);
}

export const getMeMarker = (pos) => L.circleMarker(pos, { radius: 25, color: '#536dfe', stroke: false, fillOpacity: 0.3 });
export const getMeRadiusMarker = (pos) => L.circleMarker(pos, { radius: 10, color: '#ff1744', stroke: false, fillOpacity: 1 });