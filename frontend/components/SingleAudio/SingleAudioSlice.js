import api from "../../store/api";

const singleAudioApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSingleAudio: builder.query({
      query: (id) => ({
        url: `/api/items/${id}`,
        method: "GET",
      }),
    }),
    getComments: builder.query({
      query: (audioId) => ({
        url: `api/comments/${audioId}/comment`,
        method: "GET",
      }),
    }),
    postComment: builder.mutation({
      query: ({ itemId, commentText }) => ({
        url: `api/comments/${itemId}/comments`,
        method: "POST",
        body: { commentText },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    // getReviews: builder.query({
    //   query: (itemId) => ({
    //     url: `/api/items/${itemId}/reviews`,
    //     method: "GET",
    //   }),
    // }),
    // createReview: builder.mutation({
    //   query: ({ itemId, reviewText }) => ({
    //     url: `api/reviews/${itemId}/reviews`,
    //     method: "POST",
    //     body: { reviewText },
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //   }),
    // }),
  }),
});

export const {
  useGetSingleAudioQuery,
  // useGetReviewsQuery,
  // useCreateReviewMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
} = singleAudioApi;
