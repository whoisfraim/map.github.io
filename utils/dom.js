import state from '../constants/state.js';

import { ESuggestionTypes } from '../constants/enums.js';

import { compose, eventStopPropagation, onDoubleTap } from './utils.js';

import {
  requestGeocodeByQuery,
  switchMapLayer,
  toggleGeolocation,
  setActiveMarker,
  clearActiveMarker
} from './map.js';

import { defaultTemplate, getHouse } from './addressTemplates.js';

export const initDOM = () => {
  if (state.appLoading) return;

  const { documentObjects } = state;

  const menu = new MaterialMenu(documentObjects.$tilesMenu);

  // search
  if (!documentObjects.$searchDialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  documentObjects.$searchButton.addEventListener(
    'click',
    documentObjects.$searchDialog.showModal.bind(documentObjects.$searchDialog),
  );

  documentObjects.$searchDialog.addEventListener('click', function ({ target }) {
    if (target.nodeName === 'DIALOG') {
      target.close()
    } else if (target.getAttribute('id') === 'location-button') {
      onClickFindPosition(target.children[0]);
    } else if (target.getAttribute('id') === 'location-icon') {
      onClickFindPosition(target);
    }
  });

  documentObjects.$searchInput.addEventListener('input', ({ target: { value } }) => {
    state.searchQuery = value;
    if (!state.searchQuery) renderSearchResult();
    requestGeocodeByQuery(state.searchQuery, showSearchLoading, renderSearchResult, showSearchError, hideSearchLoading);
  });

  // tiles
  documentObjects.$tilesButton.addEventListener('click', menu.toggle.bind(menu));

  documentObjects.$tilesMenu.addEventListener('click', ({ target }) => {
    if (target.hasAttribute('data-layer')) {
      const layerKey = target.getAttribute('data-layer');
      localStorage.setItem('data-layer', layerKey);
      switchMapLayer(layerKey);
    }
  });

  // geolocation
  documentObjects.$geolocationButton.addEventListener(
    'click',
    onDoubleTap(
      toggleGeolocation.bind(null, false),
      toggleGeolocation.bind(null, true),
    ),
  );

  hideLoadScreen();
};

const renderSearchResult = (data) => {
  const { $suggestionList } = state.documentObjects;

  if (!data || !data.length || state.appLoading || state.searchError) {
    hideSearchError();
    hideSearchLoading();
    return $suggestionList.innerHTML = '';
  }

  $suggestionList
    .innerHTML = data.map(({ center, properties, name }) => {
      return `
        <li class="mdl-list__item">
          <div class="mdl-list__item-primary-content" id="suggestions-wrapper">
            ${renderAddressInfoByType(properties, name)}
          </div>
          <div>
            <button
              id="location-button"
              class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
              <span
                  id="location-icon"
                  data-position="[${center.lat}, ${center.lng}]"
                  class="material-symbols-outlined">location_on</span>
            </button>
          </div>
          <div>
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
        </li>
      `
    })
    .join('');
}

export const renderAddressInfoByType = (data, name) => {
  switch (data.type) {
    case ESuggestionTypes.house:
      return getHouse(data);
    default:
      return defaultTemplate(data);
  }
}

const onClickFindPosition = (target) => {
  const position = JSON.parse(target.getAttribute('data-position'));

  const button = document.createElement('button');
  const tooltipContent = document.createElement('div');
  const info = document.createElement('div');

  button.className = 'mdl-button mdl-js-button mdl-button--raised mdl-button--accent';
  button.addEventListener('click', compose(clearActiveMarker, eventStopPropagation));
  button.innerText = 'Удалить';

  info.innerHTML = target.closest('.mdl-list__item').children[0].innerHTML;
  info.style.marginBottom = '8px'

  tooltipContent.append(info, button);

  setActiveMarker(position, tooltipContent);

  state.documentObjects.$searchDialog.close();
};

export const changeGeolocationButtonDataEnabled = (value) => (
  state.documentObjects.$geolocationButton.setAttribute('data-enabled', value)
);

export const hideLoadScreen = () => {
  const { $loadScreen, $loadedScreen } = state.documentObjects;

  $loadScreen.style.visibility = 'hidden';
  $loadedScreen.style.visibility = 'visible';
};

export const hideSearchLoading = () => {
  state.searchLoading = false;
  state.documentObjects.$searchLoader.style.visibility = 'hidden';
}

export const showSearchLoading = () => {
  if (state.searchLoading) return;

  hideSearchError();
  renderSearchResult();
  state.searchLoading = true;
  state.documentObjects.$searchLoader.style.visibility = 'visible';
};

export const hideSearchError = () => {
  state.searchError = false;
  state.documentObjects.$searchError.style.visibility = 'hidden';
}

export const showSearchError = () => {
  if (state.searchError) return;

  hideSearchLoading();
  renderSearchResult();
  state.searchError = true;
  state.documentObjects.$searchError.style.visibility = 'visible';
};
