import * as mockApi from "./mockApi";
import { httpApi } from "./httpApi";

const useMock = import.meta.env.VITE_USE_MOCK_API !== "false";

export const hotelApi = useMock ? mockApi : httpApi;
export default hotelApi; 
