import state from '../state.js';

import { disableGeolocation, requestGeocodeByQuery } from './map.js';

export const removeLoadScreen = () => {
  const { $loadScreen, $loadedScreen } = state.documentObjects;

  $loadScreen.style.visibility = 'hidden';
  $loadedScreen.style.visibility = 'visible';
};

const renderSearchResult = (data) => {
  const { $suggestionList } = state.documentObjects;

  if (!data.length) return $suggestionList.innerHTML = '';

  $suggestionList
    .innerHTML = data.map((address) => {
      return `
        <li class="mdl-list__item">
          <div class="mdl-list__item-primary-content">
            ${address.name}
          </div>
          <div>
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
              <span
                  data-pos="[${address.center.lat}, ${address.center.lng}]"
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

export const initDOM = () => {
  if (state.appLoading) return;

  const { documentObjects, map, layers } = state;

  const menu = new MaterialMenu(documentObjects.$tilesMenu);

  // search
  if (!documentObjects.$searchDialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  documentObjects.$searchButton.addEventListener('click', () => documentObjects.$searchDialog.showModal());

  documentObjects.$searchDialog.addEventListener('click', function ({ target }) {
    if (target.nodeName === 'DIALOG') {
      target.close()
    } else if (target.nodeName === 'SPAN') {
      const pos = JSON.parse(target.getAttribute('data-pos'));
      map.setView(pos, 20, { animate: true });
      documentObjects.$searchDialog.close();
    }
  });

  documentObjects.$searchInput.addEventListener('input', ({ target }) => {
    requestGeocodeByQuery(target.value, renderSearchResult);
  });

  // tiles
  documentObjects.$tilesButton.addEventListener('click', () => menu.toggle());

  documentObjects.$tilesMenu.addEventListener('click', e => {
    if (e.target.hasAttribute('data-layer')) {
      switchMapLayer(e.target.getAttribute('data-layer'))
    }
  });

  // geolocation
  documentObjects.$geolocationButton.addEventListener('click', (e) => {
    if (!JSON.parse(e.currentTarget.getAttribute('data-enabled'))) {
      e.currentTarget.setAttribute('data-enabled', true);
      map.locate({ watch: true, setView: true, timeout: 5000, enableHighAccuracy: true });
      return;
    }

    disableGeolocation();
  });

  removeLoadScreen();
};