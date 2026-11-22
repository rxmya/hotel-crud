import * as mockApi from './mockApi';
import * as httpApi from './httpApi';
export const USE_MOCK_API = import .meta.env.VITE_USE_MOCK_API !== 'false';
const hotelApi = USE_MOCK_API ? mockApi : httpApi;
export default hotelApi;