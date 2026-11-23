import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer from './hotelSlice';
export const store = configureStore({
    reducer: {
        hotels: hotelsReducer,
    },
});