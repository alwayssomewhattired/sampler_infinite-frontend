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
    reactionItem: builder.mutation({
      query: ({ itemID, reaction }) => ({
        url: `api/items/${itemID}/reactionItem`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: { reaction },
      }),
    }),
  }),
});

export const { useGetSongzQuery, useReactionItemMutation } = audioApi;
