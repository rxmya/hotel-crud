import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import hotelApi from "../api/hotelApi";
export const PAGE_SIZE = 5;
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (_, { getState }) => {
    const { filters, page } = getState().hotels;
    return hotelApi.getHotels({
      ...filters,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    });
  },
);
export const fetchHotelById = createAsyncThunk("hotels/fetchHotelById", (id) =>
  hotelApi.getHotelById(id),
);
export const createHotel = createAsyncThunk("hotels/createHotel", (values) =>
  hotelApi.createHotel(values),
);
export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  ({ id, values }) => hotelApi.updateHotel(id, values),
);
export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (id) => {
    await hotelApi.deleteHotel(id);
    return id;
  },
);
const initialState = {
  items: [], 
  total: 0, 
  page: 1,
  filters: { search: "", minPrice: "", maxPrice: "" },
  status: "idle", 
  error: null,
  current: null, 
  currentStatus: "idle",
};
const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = initialState.filters;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchHotelById.pending, (state) => {
        state.currentStatus = "loading";
        state.current = null;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.error = action.error.message;
      });
  },
});
export const { setFilters, clearFilters, setPage } = hotelsSlice.actions;
export default hotelsSlice.reducer;
