import state from '../state.js';
import { EMappedSuggestionTypes, ESuggestionTypes } from './enums.js';

import {
  requestGeocodeByQuery,
  switchMapLayer,
  toggleGeolocation,
  setView,
  setActiveMarker,
  clearActiveMarker
} from './map.js';

export const removeLoadScreen = () => {
  const { $loadScreen, $loadedScreen } = state.documentObjects;

  $loadScreen.style.visibility = 'hidden';
  $loadedScreen.style.visibility = 'visible';
};

export const renderAddressInfoByType = (data) => {
  switch (data.type) {
    case ESuggestionTypes.house:
      return `
        ${!!data?.city ? `
          <div>
            ${data.city}
          </div>
        ` : ''}
        <div>
          ${data.street}, ${EMappedSuggestionTypes.house}${data.housenumber}
        </div>
        <div>
          ${EMappedSuggestionTypes.postcode}: ${data.postcode}
        </div>
      `
    default:
      return `
        <div>
          ${data.name}
        </div>
      `
  }
}

const renderSearchResult = (data) => {
  const { $suggestionList } = state.documentObjects;

  if (!data.length) return $suggestionList.innerHTML = '';

  $suggestionList
    .innerHTML = data.map(({ center, properties, name }) => {
      return `
        <li class="mdl-list__item">
          <div class="mdl-list__item-primary-content" id="suggestions-wrapper">
            ${renderAddressInfoByType(properties)}
          </div>
          <div>
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
              <span
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

const onClickFindPosition = (target) => {
  const position = JSON.parse(target.getAttribute('data-position'));
  setView(position, 20);
  const button = document.createElement('button');
  button.className = 'mdl-button mdl-js-button mdl-button--raised';
  button.addEventListener('click', clearActiveMarker);
  button.innerText = 'Удалить';
  setActiveMarker(position, button);
  state.documentObjects.$searchDialog.close();
}

export const initDOM = () => {
  if (state.appLoading) return;

  const { documentObjects } = state;

  const menu = new MaterialMenu(documentObjects.$tilesMenu);

  // search
  if (!documentObjects.$searchDialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  documentObjects.$searchButton.addEventListener('click', () => documentObjects.$searchDialog.showModal());

  documentObjects.$searchDialog.addEventListener('click', function ({ target }) {
    if (target.nodeName === 'DIALOG') {
      target.close()
    } else if (target.nodeName === 'BUTTON') {
      onClickFindPosition(target.children[0]);
    } else if (target.nodeName === 'SPAN') {
      onClickFindPosition(target);
    }
  });

  documentObjects.$searchInput.addEventListener('input', ({ target }) => {
    requestGeocodeByQuery(target.value, renderSearchResult);
  });

  // tiles
  documentObjects.$tilesButton.addEventListener('click', menu.toggle);

  documentObjects.$tilesMenu.addEventListener('click', ({ target: { getAttribute } = {} }) => {
    if (getAttribute && !!getAttribute('data-layer')) {
      switchMapLayer(getAttribute('data-layer'))
    }
  });

  // geolocation
  documentObjects.$geolocationButton.addEventListener('dblclick', toggleGeolocation(true));
  documentObjects.$geolocationButton.addEventListener('click', toggleGeolocation());

  removeLoadScreen();
};

export const changeGeolocationButtonDataEnabled = (data) => (
  state.documentObjects.$geolocationButton.setAttribute('data-enabled', data)
);
