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
    getComments: builder.query({
      query: (itemId) => ({
        url: `api/comments/${itemId}/comments`,
        method: "GET",
      }),
    }),
    createReview: builder.mutation({
      query: ({ itemId, reviewText }) => ({
        url: `api/reviews/${itemId}/reviews`,
        method: "POST",
        body: { reviewText },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const {
  useGetSingleAudioQuery,
  useGetReviewsQuery,
  useGetCommentsQuery,
  useCreateReviewMutation,
} = singleAudioApi;
