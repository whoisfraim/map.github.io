import { EMappedSuggestionTypes } from '../constants/enums.js';

export const getHouse = (data) => (`
  <div>${data?.street}${data?.housenumber
      ? `, ${EMappedSuggestionTypes.house} ${data.housenumber}`
      : ''}
  </div>
  ${defaultTemplate(data)}
`);

export const defaultTemplate = (data) => (`
  ${!!(data?.city || data?.name) ? `<div>${EMappedSuggestionTypes.city} ${data.city || data.name}</div>` : ''}
  ${!!data?.district ? `<div>${EMappedSuggestionTypes.district} ${data.district}</div>` : ''}
  ${!!data?.state ? `<div>${EMappedSuggestionTypes.state} ${data.state}</div>` : ''}
  ${!!data?.country ? `<div>${data.country}</div>` : ''}
  ${!!data?.postcode ? `<div>${data.postcode}</div>` : ''}
`)
