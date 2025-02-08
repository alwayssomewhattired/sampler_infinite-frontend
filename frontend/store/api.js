// this is where you put the database I'm assuming

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "apiOne",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "postgresql://bridge_qg3l_user:hn2XrSnQEePgpLfS8QztgF5T59ss0XxX@dpg-cui0g5dds78s73drk4ug-a.oregon-postgres.render.com/bridge_qg3l",

    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"], //let's see if this messes anything up
  endpoints: () => ({}),
});

export default api;
