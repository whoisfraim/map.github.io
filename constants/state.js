import DOM from './DOM.js';
import map from './map.js';

export default {
  DOM,
  appLoading: true,
  search: {
    isLoading: false,
    isError: false,
    searchQuery: '',
  },
  ...map,
};
