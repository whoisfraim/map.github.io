import state from '../state.js';

import { debounce } from './utils.js';
import { changeGeolocationButtonDataEnabled } from './dom.js';
import { getSuggestions } from './api.js';

export const initMap = () => {
  if (state.appLoading) return;

  const { map, layers, geolocationLayers } = state;

  map.addLayer(layers.$2gis);

  map.on('locationfound', ({ latlng }) => {
    if (state.geolocationIsEnabled) {
      if (geolocationLayers.me || geolocationLayers.radius) {
        map.removeLayer(geolocationLayers.me);
        map.removeLayer(geolocationLayers.radius);
      }

      geolocationLayers.me = getMeRadiusMarker(latlng).addTo(map);
      geolocationLayers.radius = getMeMarker(latlng).addTo(map);
    }
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

export const toggleGeolocation = (watch = false) => () => {
  const { map, geolocationIsEnabled } = state;

  if (geolocationIsEnabled) {
    map.stopLocate();
    changeGeolocationButtonDataEnabled(false);
    state.geolocationIsEnabled = false;
    return;
  }

  if (watch) {
    changeGeolocationButtonDataEnabled(true);
    state.geolocationIsEnabled = true;
  }
  map.locate({ watch, setView: true, timeout: 5000, enableHighAccuracy: true });
};

export const requestGeocodeByQuery = debounce((query, successCallback) => {
  if (!query) return successCallback([]);
  const { map } = state;
  const { lat, lng } = map.getCenter()

  const searchParams = {
    q: query,
    lat: lat,
    lon: lng,
  };

  getSuggestions(searchParams, successCallback);
}, 500);

export const setView = (position, zoom) => state.map.setView(position, zoom, { animate: true });

export const clearActiveMarker = () => {
  if (state.activeMarker === null) return;

  state.map.removeLayer(state.activeMarker);
  state.activeMarker.off();
  state.activeMarker = null;
}

export const setActiveMarker = (position, title) => {
  clearActiveMarker();
  state.activeMarker = L.marker(position).addTo(state.map).bindPopup(title);
  state.activeMarker.on('click', state.activeMarker.toggleTooltip)
}

export const getMeMarker = (pos) => L.circleMarker(pos, { radius: 25, color: '#536dfe', stroke: false, fillOpacity: 0.3 });
export const getMeRadiusMarker = (pos) => L.circleMarker(pos, { radius: 10, color: '#ff1744', stroke: false, fillOpacity: 1 });