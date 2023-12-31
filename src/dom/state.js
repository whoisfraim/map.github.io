import { EMapLayersKeys } from '@/enums';

export default {
  $elements: {
    mapContainer: document.querySelector('#map'),
    loadScreen: document.querySelector('#load-screen'),
    loadedScreen: document.querySelector('#loaded-screen'),
    searchButton: document.querySelector('#search-button'),
    tilesButton: document.querySelector('#tiles-button'),
    geolocationButton: document.querySelector('#geolocation-button'),
    searchDialog: document.querySelector('#search-dialog-content'),
    searchInput: document.querySelector('#search-input'),
    searchLoader: document.querySelector('#search-loader-container'),
    searchError: document.querySelector('#search-error'),
    suggestionList: document.querySelector('#suggestions-list'),
  },
  mui: {
    tilesMenu: new MaterialMenu(document.querySelector('#tiles-menu')),
    tilesMenuActiveKey: localStorage.getItem('data-layer') || EMapLayersKeys.$2gis,
  },
};
