export const ORSApiKey = '5b3ce3597851110001cf62487b9d8b3b5e4a4ded989e01958956fbda';

export const defaultFetchOptions = {
  method: 'GET',
  headers: { 'Accept': 'application/json' },
};

export const geocodingApiOptions = {
  serviceUrl: 'https://photon.komoot.io/api/',
  reverseUrl: 'https://photon.komoot.io/reverse/',
  nameProperties: ['name', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country'],
};
