import DOM from '../dom/state';

import { EMapLayersKeys } from '../enums';

const state = L.map(
  DOM.$mapContainer,
  {
    center: [45.05853056136878, 38.97168592724484],
    zoom: 11,
    renderer: L.canvas(),
    touchZoom: true,
    doubleClickZoom: false,
  },
);

const layers = {
  [EMapLayersKeys.$2gis]: L?.tileLayer('https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    reuseTiles: true,
    updateWhenIdle: false,
  }),
  [EMapLayersKeys.$google]: L?.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    reuseTiles: true,
    updateWhenIdle: false,
  }),
};

const icons = {
  red: L.icon({
    iconUrl: './static/red-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
  primary: L.icon({
    iconUrl: './static/primary-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
  disabled: L.icon({
    iconUrl: './static/disabled-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
};

export default {
  map: state,
  layers,
  icons,
  geolocationLayers: {
    me: null,
    radius: null,
  },
  geolocationIsEnabled: false,
  geolocationIsFirstLocation: true,
  activeMarker: null,
};
