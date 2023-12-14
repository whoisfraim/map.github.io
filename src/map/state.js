import { map as Map, tileLayer, icon } from 'leaflet';

import redMarker from '@/assets/markers/red-marker.png'
import primaryMarker from '@/assets/markers/primary-marker.png'
import disabledMarker from '@/assets/markers/disabled-marker.png'

import DOM from '@/dom/state';

import { EMapLayersKeys } from '@/enums';

const map = Map(
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
    iconUrl: redMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
  primary: icon({
    iconUrl: primaryMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
  disabled: icon({
    iconUrl: disabledMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  }),
};

const geolocationLayers = {
  me: null,
  radius: null,
};

export default {
  map,
  layers,
  icons,
  geolocationLayers,
  geolocationIsEnabled: false,
  geolocationIsFirstLocation: true,
  activeMarker: null,
};
