// this is where you put the database I'm assuming

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "apiOne",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      // const username = "postgres";
      // const password = "palestinedeathcircle";
      // const basicAuth = `Basic ${btoa(username + ":" + password)}`;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("Access-Control-Allow-Origin", "*");
      // headers.set("Authorization", basicAuth);
      return headers;
    },
  }),
  tagTypes: ["User"], //let's see if this messes anything up
  endpoints: () => ({}),
});

export default api;
