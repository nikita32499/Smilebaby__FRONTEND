import { isNotBrowser } from 'shared/helpers/isNotBrowser';

export const REACT_BASE_API_URL = isNotBrowser() ? '' : `${window.location.origin}/api`;
