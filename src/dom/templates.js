import { EMappedSuggestionTypes, ESuggestionTypes } from '@/enums';

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
        <svg
          id="location-icon"
          data-position="[${center.lat}, ${center.lng}]"
          width="24"
          height="24"
          viewBox="0 -960 960 960"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="location-icon-path"
            d="M480-301q99-80 149.5-154T680-594q0-56-20.5-95.5t-50.5-64Q579-778 544-789t-64-11q-29 0-64
            11t-65 35.5q-30 24.5-50.5 64T280-594q0 65 50.5 139T480-301Zm0 101Q339-304 269.5-402T200-594q0-71
            25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5
            192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33
            23.5 56.5T480-520ZM200-80v-80h560v80H200Zm280-514Z"
            fill="#fff"
          />
        </svg>
      </button>
    </div>
    <div>
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
        <svg width="24" height="24" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" fill="#fff"/>
        </svg>
      </button>
    </div>
  </li>
`);

const getDefaultAddressTemplate = (props) => (`
  ${!!props?.district ? `<div>${EMappedSuggestionTypes.district} ${props.district}</div>` : ''}
  ${!!(props?.city || props?.name) ? `<div>${EMappedSuggestionTypes.city} ${props.city || props.name}</div>` : ''}
  ${!!props?.state ? `<div>${EMappedSuggestionTypes.state} ${props.state}</div>` : ''}
  ${!!props?.country ? `<div>${props.country}</div>` : ''}
  ${!!props?.postcode ? `<div>${props.postcode}</div>` : ''}
`);

const getAddressHouseTemplate = (props) => (`
  <div>
    ${props?.street}${props?.housenumber ? `, ${EMappedSuggestionTypes.house} ${props.housenumber}`: ''}
  </div>
  ${getDefaultAddressTemplate(props)} 
`);

const renderAddressInfoBySuggestionType = (props) => {
  switch (props.type) {
    case ESuggestionTypes.house:
      return getAddressHouseTemplate(props);
    default:
      return getDefaultAddressTemplate(props);
  }
};
