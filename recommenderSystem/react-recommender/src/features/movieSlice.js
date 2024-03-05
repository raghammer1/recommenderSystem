import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allMovies: [],
  totalPages: 500,
  currentPage: null,
  isLoading: true,
  selectedItems: [],
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setCart: (state, { payload }) => {
      console.log(payload.allMovies, 'I AM YOU PAYLOAD');
      state.allMovies = payload.allMovies;
      state.isLoading = false;
    },
  },
});

export default movieSlice.reducer;
export const { setCart } = movieSlice.actions;
