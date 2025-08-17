import api from "../../store/api";

const audiosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPacks: builder.query({
      query: () => ({
        url: "/api/items/allPacks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    reactionItemToAudios: builder.mutation({
      query: ({ itemID, reaction }) => ({
        url: `api/items/reactionItems/${itemID}/`,
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

export const { useGetPacksQuery, useReactionItemToAudiosMutation } = audiosApi;
