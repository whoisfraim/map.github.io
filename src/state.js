import DOM from '@/dom/state';
import map from '@/map/state';

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
