import { map, tileLayer, icon } from 'leaflet';

import DOM from '@/dom/state';

import { EMapLayersKeys } from '@/enums';

const state = map(
  DOM.$elements.mapContainer,
  {
    center: [45.05853056136878, 38.97168592724484],
    zoom: 11,
    renderer: L.canvas(),
    touchZoom: true,
    doubleClickZoom: false,
  },
);

const layers = {
  [EMapLayersKeys.$2gis]: tileLayer('https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    reuseTiles: true,
    updateWhenIdle: false,
  }),
  [EMapLayersKeys.$google]: tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    reuseTiles: true,
    updateWhenIdle: false,
  }),
};

const icons = {
  red: icon({
    iconUrl: 'static/icons/red-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
  primary: icon({
    iconUrl: 'static/icons/primary-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
  disabled: icon({
    iconUrl: 'static/icons/disabled-marker.png',
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
