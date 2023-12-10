import state from '../state.js';

import { compose, every } from './utils.js';

export const fetchData = (
  url = null,
  params = null,
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
) => {
  if (!url) return console.error('fetchData must have at least the first argument: url');

  const onSuccess = compose(successCallback, checkStatusResponse);
  const onError = every(errorCallback, console.error);

  fetch(`${url}${params ? `?${new URLSearchParams(params)}` : ''}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  })
    .then(onSuccess)
    .catch(onError)
    .finally(finallyCallback);
};

const checkStatusResponse = (response) => {
  if (!response.ok) throw new Error(`Status: ${response.status}, ${response.statusText}`);

  return response.json();
}

export const getSuggestions = (params, successCallback, errorCallback) => {
  const onSuccess = compose(successCallback, decodeFeatures);

  fetchData(state.apiOptions.serviceUrl, params, onSuccess, errorCallback);
};

// decodes photon response
const decodeFeatures = ({ features } = {}) => {
  if (!features?.length) return [];

  return features.map((feature) => ({
    name: decodeFeatureName(feature),
    center: L.latLng(feature.geometry.coordinates.reverse()),
    properties: feature.properties,
  }));
};

const decodeFeatureName = (feature) => (
  state.apiOptions.nameProperties
    .map(prop => feature.properties[prop])
    .filter(prop => !!prop)
    .join(', ')
);
