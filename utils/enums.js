export const ESuggestionTypes = {
  house: 'house',
  street: 'street',
  locality: 'locality',
  district: 'district',
  city: 'city',
  county: 'county',
  state: 'state',
  country: 'country',
  name: 'name',
};

export const EMappedSuggestionTypes = {
  house: 'д.',
  street: 'ул.',
  locality: 'мст.',
  district: 'р-н',
  city: 'г.',
  county: 'г.о.',
  state: 'обл.',
  country: 'страна',
  postcode: 'почтовый индекс'
}

export const ESuggestionPropertiesForTranslate = [
  ESuggestionTypes.country,
  ESuggestionTypes.city,
  ESuggestionTypes.county,
  ESuggestionTypes.street,
  ESuggestionTypes.district,
  ESuggestionTypes.state,
  ESuggestionTypes.name,
];
