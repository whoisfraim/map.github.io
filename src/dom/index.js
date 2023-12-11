import state from '../state';

import { compose } from '../utils/pure';
import { eventStopPropagation, onDoubleTap } from '../utils/events';
import { getSuggestionsListItemTemplate } from '../utils/templates';

import {
  requestGeocodeByQuery,
  switchMapLayer,
  toggleGeolocation,
  setActiveMarker,
  clearActiveMarker,
} from '../map';

export const hideLoadScreen = () => {
  state.DOM.$loadScreen.style.visibility = 'hidden';
  state.DOM.$loadedScreen.style.visibility = 'visible';
};

export const initDOM = () => {
  if (state.appLoading) return;

  const { DOM } = state;

  // search
  if (!DOM.$searchDialog.showModal) {
    dialogPolyfill.registerDialog(DOM.$searchDialog);
  }

  DOM.$searchButton.addEventListener(
    'click',
    DOM.$searchDialog.showModal.bind(DOM.$searchDialog),
  );

  DOM.$searchDialog.addEventListener('click', handleClickOnDialog);

  DOM.$searchInput.addEventListener('input', handleSearchInput);

  // tiles
  DOM.$tilesButton.addEventListener('click', DOM.tilesMenu.toggle.bind(DOM.tilesMenu));
  DOM.tilesMenu.element_.addEventListener('click', handleClickOnTilesMenu);

  // geolocation
  DOM.$geolocationButton.addEventListener(
    'click',
    onDoubleTap(
      toggleGeolocation.bind(null, false),
      toggleGeolocation.bind(null, true),
    ),
  );

  hideLoadScreen();
};

const handleClickOnDialog = ({ target }) => {
  switch (true) {
    case target.nodeName === 'DIALOG':
      return target.close();
    case target.getAttribute('id') === 'location-icon':
      return onClickFindPosition(target);
    case target.getAttribute('id') === 'location-button':
      return onClickFindPosition(target.children[0]);
    default:
      return;
  }
};

const handleSearchInput = (event) => {
  state.search.query = event.target?.value || '';

  if (!state.search.query) renderSearchResult();

  requestGeocodeByQuery(
    state.search.query,
    showSearchLoading,
    renderSearchResult,
    showSearchError,
    hideSearchLoading,
  );
};

const handleClickOnTilesMenu = ({ target }) => {
  if (!target.hasAttribute('data-layer')) return;

  const layerKey = target.getAttribute('data-layer');
  localStorage.setItem('data-layer', layerKey);
  switchMapLayer(layerKey);
};

const renderSearchResult = (data) => {
  if (data && data?.length && !state.appLoading && !state.search.isError) {
    state.DOM.$suggestionList.innerHTML = data.map(getSuggestionsListItemTemplate).join('');
    return;
  }

  hideSearchError();
  hideSearchLoading();
  state.DOM.$suggestionList.innerHTML = '';
}

const onClickFindPosition = (target) => {
  const position = JSON.parse(target.getAttribute('data-position'));

  const tooltipContent = document.createElement('div');
  const button = document.createElement('button');
  const info = document.createElement('div');

  info.innerHTML = target.closest('.mdl-list__item').children[0].innerHTML;
  info.style.marginBottom = '8px';

  button.className = 'test mdl-button mdl-js-button mdl-button--raised mdl-button--accent';
  button.addEventListener('click', compose(clearActiveMarker, eventStopPropagation));
  button.innerText = 'Удалить';

  tooltipContent.append(info, button);

  setActiveMarker(position, tooltipContent);

  state.DOM.$searchDialog.close();
};

export const changeGeolocationButtonDataEnabled = (value) => (
  state.DOM.$geolocationButton.setAttribute('data-enabled', value)
);

export const hideSearchLoading = () => {
  state.search.isLoading = false;
  state.DOM.$searchLoader.style.visibility = 'hidden';
}

export const showSearchLoading = () => {
  if (state.search.isLoading) return;

  hideSearchError();
  renderSearchResult();
  state.search.isLoading = true;
  state.DOM.$searchLoader.style.visibility = 'visible';
};

export const hideSearchError = () => {
  state.search.isError = false;
  state.DOM.$searchError.style.visibility = 'hidden';
}

export const showSearchError = () => {
  if (state.search.isError) return;

  hideSearchLoading();
  renderSearchResult();
  state.search.isError = true;
  state.DOM.$searchError.style.visibility = 'visible';
};
