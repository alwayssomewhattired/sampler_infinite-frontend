import api from "../../store/api";

const singleUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyComments: builder.query({
      query: () => ({
        url: `api/comments/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    // itemIds in query instead of params!
    getSongs: builder.query({
      query: (itemIds) => ({
        url: `/api/items/specificItems?itemIds=${itemIds?.join(",")}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    updateComment: builder.mutation({
      query: ({ commentId, commentText }) => ({
        url: `api/comments/updateComments/${commentId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: { commentText },
      }),
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/api/comments/${commentId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    // getMyReviews: builder.query({
    //   query: () => ({
    //     url: "/api/reviews/me",
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //   }),
    // }),
  }),
});

export const {
  useGetMyCommentsQuery,
  useGetSongsQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = singleUserApi;
