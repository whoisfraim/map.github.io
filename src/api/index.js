import translate from '../../static/scripts/translate';

import { ESuggestionPropertiesForTranslate } from '../enums';
import { defaultFetchOptions, geocodingApiOptions } from './constants';

import { compose, every, reverseCurrying } from '../utils/pure';

export const translateToRU = reverseCurrying(translate, 'ru');

export const fetchData = (
  url = null,
  params = null,
  requestCallback = () => {},
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
  options = null
) => {
  if (!url) return console.error('fetchData must have at least the first argument: url');

  const onSuccess = compose(successCallback, checkStatusResponse);
  const onError = every(errorCallback, console.error);

  const queryString = params ? `?${new URLSearchParams(params)}` : '';

  if (typeof requestCallback === 'function') requestCallback();

  fetch(`${url}${queryString}`, options || defaultFetchOptions)
    .then(onSuccess)
    .catch(onError)
    .finally(finallyCallback);
};

const checkStatusResponse = async (response) => {
  if (!response.ok) throw new Error(`Status: ${response.status}, ${response.statusText}`);

  return await response.json();
};

export const getSuggestions = (
  params,
  requestCallback,
  successCallback,
  errorCallback,
  finallyCallback,
) => {
  const onSuccess = compose(successCallback, translateFeatureProperties, mapFeatures);

  fetchData(
    geocodingApiOptions.serviceUrl,
    params,
    requestCallback,
    onSuccess,
    errorCallback,
    finallyCallback,
  );
};

const mapFeatures = ({ features } = {}) => {
  if (!features?.length) return [];

  return features.map((feature) => ({
    ...feature,
    center: L.latLng(feature.geometry.coordinates.reverse()),
  }));
};

const translateFeatureProperties = async (features) => (
  await Promise.all(
    features.map(async (feature) => {
      const propertiesEntries = Object.entries(feature.properties);

      const propertiesForTranslation = propertiesEntries.map(
        ([key, value], idx) => {
          if (ESuggestionPropertiesForTranslate.includes(key) && value.search(/[a-zA-Z]/g) >= 0) {
            return value;
          }

          return idx;
        },
      );

      const translatedProperties = (await translateToRU(propertiesForTranslation)).split(',');

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
