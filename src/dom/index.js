import dialogPolyfill from 'dialog-polyfill';

import state from '@/state';
import { tilesMenuItemActiveClassList } from './constants';

import { compose } from '@/utils/pure';
import { eventStopPropagation, onDoubleTap } from '@/utils/events';
import { getSuggestionsListItemTemplate } from './templates';

import {
  requestGeocodeByQuery,
  switchMapLayer,
  toggleGeolocation,
  setActiveMarker,
  clearActiveMarker,
} from '@/map';

export const initDOM = () => {
  if (state.appLoading) return;

  const { DOM } = state;

  // search
  if (!DOM.$elements.searchDialog.showModal) {
    dialogPolyfill.registerDialog(DOM.$elements.searchDialog);
  }

  DOM.$elements.searchButton.addEventListener(
    'click',
    DOM.$elements.searchDialog.showModal.bind(DOM.$elements.searchDialog),
  );

  DOM.$elements.searchDialog.addEventListener('click', handleClickOnDialog);

  DOM.$elements.searchInput.addEventListener('input', handleSearchInput);

  // tiles
  DOM.$elements.tilesButton.addEventListener('click', DOM.mui.tilesMenu.toggle.bind(DOM.mui.tilesMenu));
  DOM.mui.tilesMenu.element_.addEventListener('click', handleClickOnTilesMenu);

  // geolocation
  DOM.$elements.geolocationButton.addEventListener(
    'click',
    onDoubleTap(
      toggleGeolocation.bind(null, false),
      toggleGeolocation.bind(null, true),
    ),
  );

  setActiveLayerByKey(DOM.mui.tilesMenuActiveKey);

  hideLoadScreen();
};

const hideLoadScreen = () => {
  state.DOM.$elements.loadScreen.style.visibility = 'hidden';
  state.DOM.$elements.loadedScreen.style.visibility = 'visible';
};

const handleClickOnDialog = ({ target }) => {
  switch (true) {
    case target.nodeName === 'DIALOG':
      return target.close();
    case target.getAttribute('id') === 'location-icon-path':
      return onClickFindPosition(target.parentNode);
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

  if (!state.search.query) return;

  requestGeocodeByQuery(
    state.search.query,
    showSearchLoading,
    onSuccessRequestGeocodeByQuery,
    showSearchError,
    hideSearchLoading,
  );
};

const onSuccessRequestGeocodeByQuery = (data) => {
  hideSearchError();
  hideSearchLoading();
  renderSearchResult(data);
}

const handleClickOnTilesMenu = ({ target }) => {
  const layerKey = target.getAttribute('data-layer');

  if (!layerKey || state.DOM.mui.tilesMenuActiveKey === layerKey) return;

  state.DOM.mui.tilesMenuActiveKey = layerKey;
  localStorage.setItem('data-layer', layerKey);
  setActiveLayerByKey(layerKey);
  switchMapLayer(layerKey);
};

const setActiveLayerByKey = (key) => {
  document.querySelectorAll(`[data-layer]`).forEach((tilesMenuItem) => {
    if (tilesMenuItem.getAttribute('data-layer') === key) {
      tilesMenuItem.classList.add(...tilesMenuItemActiveClassList);
    } else {
      tilesMenuItem.classList.remove(...tilesMenuItemActiveClassList);
    }
  });
};

const renderSearchResult = (data) => {
  if (data && data?.length && !state.search.isLoading && !state.search.isError) {
    state.DOM.$elements.suggestionList.innerHTML = data.map(getSuggestionsListItemTemplate).join('');
    return;
  }

  state.DOM.$elements.suggestionList.textContent = '';
};

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

  state.DOM.$elements.searchDialog.close();
};

export const changeGeolocationButtonDataEnabled = (value) => (
  state.DOM.$elements.geolocationButton.setAttribute('data-enabled', value)
);

export const hideSearchLoading = () => {
  state.search.isLoading = false;
  state.DOM.$elements.searchLoader.style.visibility = 'hidden';
};

export const showSearchLoading = () => {
  if (state.search.isLoading) return;

  hideSearchError();
  renderSearchResult();

  state.search.isLoading = true;
  state.DOM.$elements.searchLoader.style.visibility = 'visible';
};

export const hideSearchError = () => {
  state.search.isError = false;
  state.DOM.$elements.searchError.style.visibility = 'hidden';
};

export const showSearchError = () => {
  if (state.search.isError) return;

  hideSearchLoading();
  renderSearchResult();

  state.search.isError = true;
  state.DOM.$elements.searchError.style.visibility = 'visible';
};
