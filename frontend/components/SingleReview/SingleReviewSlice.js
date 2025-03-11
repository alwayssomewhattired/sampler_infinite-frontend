import api from "../../store/api";

const singleReviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReview: builder.query({
      query: ({ audioId, reviewId }) => ({
        url: `api/reviews/${audioId}/reviews/${reviewId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    getComments: builder.query({
      query: (audioId) => ({
        url: `api/comments/${audioId}/comments`,
        method: "GET",
      }),
    }),
    postComment: builder.mutation({
      query: ({ audioId, reviewId, commentText }) => ({
        url: `api/comments/${audioId}/reviews/${reviewId}/comments`,
        method: "POST",
        body: { commentText },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useGetReviewQuery, useGetCommentsQuery, usePostCommentMutation } = singleReviewApi;
