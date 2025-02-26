import api from "../../store/api";

const audioApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSongs: builder.query({
      query: () => ({
        url: "/api/items/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useGetSongsQuery } = audioApi;
