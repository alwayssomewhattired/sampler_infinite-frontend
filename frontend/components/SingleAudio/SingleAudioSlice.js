import api from "../../store/api";

const singleAudioApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSingleAudio: builder.query({
      query: (id) => ({
        url: `/api/items/${id}`,
        method: "GET",
      }),
    }),
    getReviews: builder.query({
      query: (itemId) => ({
        url: `/api/items/${itemId}/reviews`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSingleAudioQuery, useGetReviewsQuery } = singleAudioApi;
