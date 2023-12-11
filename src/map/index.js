import state from '../state';

import { EMapLayersKeys } from '../enums';

import { debounce } from '../utils/delays';

import { getSuggestions } from '../api';

import { changeGeolocationButtonDataEnabled } from '../dom';

export const initMap = () => {
  if (state.appLoading) return;

  const storageLayerKey = localStorage.getItem('data-layer') || EMapLayersKeys.$2gis;
  state.map.addLayer(state.layers[storageLayerKey]);

  state.map.on('locationfound', handleLocationFound);
  state.map.on('locationerror', handleLocationError);
};

export const switchMapLayer = (layer) => {
  switch (layer) {
    case EMapLayersKeys.$2gis:
      state.map.removeLayer(state.layers.$google);
      state.map.addLayer(state.layers.$2gis);
      break;
    case EMapLayersKeys.$google:
      state.map.removeLayer(state.layers.$2gis);
      state.map.addLayer(state.layers.$google);
      break;
  }
};

export const toggleGeolocation = (watch = false) => {
  if (state.geolocationIsEnabled) return disableGeolocation();

  if (watch) {
    state.geolocationIsEnabled = true;
    changeGeolocationButtonDataEnabled(true);
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
  if (state.search.isLoading || !query) return;

  const { lat, lng } = state.map.getCenter();

  const searchParams = {
    q: query,
    lat: lat,
    lon: lng,
    limit: 5,
  };

  getSuggestions(searchParams, requestCallback, successCallback, errorCallback, finallyCallback);
}, 1000);

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

const setView = (position, zoom) => state.map.setView(position, zoom, { animate: true });
const createMeMarker = (pos) => L.circleMarker(pos, { radius: 25, color: '#536dfe', stroke: false, fillOpacity: 0.3 });
const createMeRadiusMarker = (pos) => L.circleMarker(pos, { radius: 10, color: '#ff1744', stroke: false, fillOpacity: 1 });

const handleLocationFound = ({ latlng }) => {
  if (state.geolocationIsFirstLocation) {
    state.map.setView(latlng, 20);
    state.geolocationIsFirstLocation = false;
  }

  clearGeolocationMarker();
  state.geolocationLayers.me = createMeRadiusMarker(latlng).addTo(state.map);
  state.geolocationLayers.radius = createMeMarker(latlng).addTo(state.map);
}

const handleLocationError = () => {
  alert('Не удалось получить геолокацию!');
  toggleGeolocation();
};

const clearGeolocationMarker = () => {
  if (!state.geolocationLayers.me && !state.geolocationLayers.radius) return;

  state.map.removeLayer(state.geolocationLayers.me);
  state.map.removeLayer(state.geolocationLayers.radius);
}

const disableGeolocation = () => {
  state.geolocationIsEnabled = false;
  state.map.stopLocate();
  clearGeolocationMarker();
  changeGeolocationButtonDataEnabled(false);
}
