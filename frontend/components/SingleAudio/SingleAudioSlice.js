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
    getUsers: builder.query({
      query: ({ ids }) => {
        console.log("HEYEYEYEYEY");
        return {
          url: `api/users/allUserNamez`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        };
      },
    }),
    reactionItemza: builder.mutation({
      query: ({ itemID, reaction }) => {
        console.log("HEYEYEYEYEY");
        return {
          url: `api/items/reactionItem/${itemID}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: { reaction },
        };
      },
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
    postReplies: builder.mutation({
      query: ({ replyText, parentCommentId, itemID }) => ({
        url: `api/comments/reply`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: { replyText, parentCommentId, itemID },
      }),
    }),
    getReaction: builder.query({
      query: ({ commentIDs }) => ({
        url: `api/comments/reactionType`,
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: { commentIDs },
      }),
    }),
    reactionComment: builder.mutation({
      query: ({ commentID, reaction }) => ({
        url: `api/comments/${commentID}/reactionComment`,
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

export const {
  useGetSingleAudioQuery,
  useGetUsersQuery,
  useGetCommentsQuery,
  usePostRepliesMutation,
  usePostCommentMutation,
  useGetReactionQuery,
  useReactionCommentMutation,
  useReactionItemzaMutation,
} = singleAudioApi;
