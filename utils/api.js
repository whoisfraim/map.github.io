import translate from '../scripts/translate.js';

import state from '../constants/state.js';

import { ESuggestionPropertiesForTranslate } from '../constants/enums.js';

import { compose, every, reverseCurrying } from './utils.js';

export const fetchData = (
  url = null,
  params = null,
  requestCallback = () => {},
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
) => {
  if (!url) return console.error('fetchData must have at least the first argument: url');

  const onSuccess = compose(successCallback, checkStatusResponse);
  const onError = every(errorCallback, console.error);

  const options = {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  };

  const queryString = params ? `?${new URLSearchParams(params)}` : '';

  if (typeof requestCallback === 'function') {
    requestCallback();
  }

  fetch(`${url}${queryString}`, options)
    .then(onSuccess)
    .catch(onError)
    .finally(finallyCallback);
};

const checkStatusResponse = (response) => {
  if (!response.ok) throw new Error(`Status: ${response.status}, ${response.statusText}`);

  return response.json();
};

export const getSuggestions = (params, requestCallback, successCallback, errorCallback, finallyCallback) => {
  const onSuccess = compose(successCallback, translateFeatureProperties, mapFeatures);

  fetchData(state.apiOptions.serviceUrl, params, requestCallback, onSuccess, errorCallback, finallyCallback);
};

const mapFeatures = ({ features } = {}) => {
  if (!features?.length) return [];

  return features.map((feature) => ({
    ...feature,
    center: L.latLng(feature.geometry.coordinates.reverse()),
  }));
};

const ruTranslate = reverseCurrying(translate, 'ru');

const translateFeatureProperties =  async (features) => (
  await Promise.all(
    features.map(async (feature) => {
      const propertiesEntries = Object.entries(feature.properties);

      let propertiesForTranslation = propertiesEntries.map(
        ([key, value], idx) => {
          if (ESuggestionPropertiesForTranslate.includes(key) && value.search(/[a-zA-Z]/g) >= 0) {
            return value;
          }

          return idx;
        },
      );

      const translatedProperties = (await ruTranslate(propertiesForTranslation)).split(',');

      const properties= Object.fromEntries(
        propertiesEntries.map(
          (item, idx) => {
            if (+translatedProperties[idx] === idx) return item;

            return [item[0], translatedProperties[idx]];
          },
        ),
      );

      return { ...feature, properties };
    }),
  )
);
