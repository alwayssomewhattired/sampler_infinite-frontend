import { configureStore } from "@reduxjs/toolkit";
import api from "./api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getdefaultmiddleware) =>
    getdefaultmiddleware().concat(api.middleware),
});

export default store;
