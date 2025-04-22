import api from "../../store/api";

const audioApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSongz: builder.query({
      query: () => ({
        url: "/api/items/allItems",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useGetSongzQuery } = audioApi;
