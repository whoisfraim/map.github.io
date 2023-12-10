import { EMappedSuggestionTypes } from './enums.js';

export const getHouse = (data) => (`
  <div>
    ${data?.street}
    ${data?.housenumber ? `, ${EMappedSuggestionTypes.house} ${data.housenumber}` : ''}
  </div>
  ${defaultTemplate(data)}
`);

export const defaultTemplate = (data) => (`
  ${!!(data?.city || data?.name) ? `<div>${EMappedSuggestionTypes.city} ${data.city || data.name}</div>` : ''}
  ${!!data?.district || !!data?.state ? `
    <div>
      ${!!data?.district ? `${EMappedSuggestionTypes.district} ${data.district}` : ''}
      ${!!data?.state ? `${!!data?.district ? ', ' : ''}${EMappedSuggestionTypes.state} ${data.state}` : ''}
    </div>
  ` : ''}
  ${!!data?.country ? `<div>${data.country}</div>` : ''}
  ${!!data?.postcode ? `<div>${data.postcode}</div>` : ''}
`)
