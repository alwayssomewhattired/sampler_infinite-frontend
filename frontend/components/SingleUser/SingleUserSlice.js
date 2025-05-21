import api from "../../store/api";

const singleUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSelfToSingleUser: builder.query({
      query: () => ({
        url: `/api/users/aboutSelf`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
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
    getUser: builder.query({
      query: () => ({
        url: "/api/users/aboutMe",
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
    createPhoto: builder.mutation({
      query: (formData) => ({
        url: `api/users/profilePhoto`,
        method: "POST",
        body: formData,
      }),
    }),
    createPhotoDB: builder.mutation({
      query: (photoId) => ({
        url: `api/users/profilePhotoDB`,
        method: "POST",
        body: photoId,
      }),
    }),
  }),
});

export const {
  useGetMyCommentsQuery,
  useGetSongsQuery,
  useGetUserQuery,
  useGetSelfToSingleUserQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useCreatePhotoMutation,
  useCreatePhotoDBMutation,
} = singleUserApi;
