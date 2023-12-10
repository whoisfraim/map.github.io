import { EMappedSuggestionTypes, ESuggestionTypes } from '../constants/enums.js';

export const getDefaultAddressTemplate = (props) => (`
  ${!!props?.district ? `<div>${EMappedSuggestionTypes.district} ${props.district}</div>` : ''}
  ${!!(props?.city || props?.name) ? `<div>${EMappedSuggestionTypes.city} ${props.city || props.name}</div>` : ''}
  ${!!props?.state ? `<div>${EMappedSuggestionTypes.state} ${props.state}</div>` : ''}
  ${!!props?.country ? `<div>${props.country}</div>` : ''}
  ${!!props?.postcode ? `<div>${props.postcode}</div>` : ''}
`);

export const getAddressHouseTemplate = (props) => (`
  <div>${props?.street}${props?.housenumber
  ? `, ${EMappedSuggestionTypes.house} ${props.housenumber}`
  : ''}
  </div>
  ${getDefaultAddressTemplate(props)}
`);

export const renderAddressInfoBySuggestionType = (props) => {
  switch (props.type) {
    case ESuggestionTypes.house:
      return getAddressHouseTemplate(props);
    default:
      return getDefaultAddressTemplate(props);
  }
};

export const getSuggestionsListItemTemplate = ({ center, properties }) => (`
  <li class="mdl-list__item">
    <div class="mdl-list__item-primary-content" id="suggestions-wrapper">
      ${renderAddressInfoBySuggestionType(properties)}
    </div>
    <div>
      <button
        id="location-button"
        class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"
      >
        <img
          src="/static/pin_drop.svg"
          id="location-icon"
          data-position="[${center.lat}, ${center.lng}]"
          width="24"
          height="24"
          alt="?"
        />
      </button>
    </div>
    <div>
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
        <img src="/static/add.svg" width="24" height="24" alt="+" />
      </button>
    </div>
  </li>
`);
