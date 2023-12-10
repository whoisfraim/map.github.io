const $mapContainer = document.querySelector('#map');

export default {
  appLoading: true,
  apiOptions: {
    serviceUrl: 'https://photon.komoot.io/api/',
    reverseUrl: 'https://photon.komoot.io/reverse/',
    nameProperties: ['name', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country'],
  },
  documentObjects: {
    $loadScreen: document.querySelector('#load-screen'),
    $loadedScreen: document.querySelector('#loaded-screen'),
    $mapContainer,
    $searchButton: document.querySelector('#search-button'),
    $tilesButton: document.querySelector('#tiles-button'),
    $tilesMenu: document.querySelector('#tiles-menu'),
    $geolocationButton: document.querySelector('#geolocation-button'),
    $searchDialog: document.querySelector('#search-dialog-content'),
    $searchInput: document.querySelector('#search-input'),
    $suggestionList: document.querySelector('#suggestion-list'),
  },
  map: L.map(
    $mapContainer,
    {
      center: [45.05853056136878, 38.97168592724484],
      zoom: 11,
      renderer: L.canvas(),
      touchZoom: true,
      doubleClickZoom: false,
    },
  ),
  layers: {
    $2gis: L?.tileLayer('http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
      subdomains:['mt0','mt1','mt2','mt3'],
      reuseTiles: true,
      updateWhenIdle: false
    }),
    $google: L?.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains:['mt0','mt1','mt2','mt3'],
      reuseTiles: true,
      updateWhenIdle: false
    }),
  },
  geolocationLayers: {
    me: null,
    radius: null,
  },
  geolocationIsEnabled: false,
  activeMarker: null,
}
