import api from "../../store/api";

const singleUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ token, id }) => ({
        url: `/api/users/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
      providesTags: ["User"],
    }),
    update: builder.mutation({
      //I don't know if all of these things belong in the query
      query: ({ token, id, email, normal_password }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id,
          email,
          normal_password,
        }),
        // body: JSON.stringify({
        //I don't know if this is correct
        //   id: id,
        //   first_name: first_name,
        //   last_name: last_name,
        //   email: email,
        //   password: normal_password,
        // }),
      }),
      invalidatesTags: ["User"],
    }),
    getMyReviews: builder.query({
      query: () => ({
        url: "/api/reviews/me",
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
  }),
});

export const {
  useUpdateMutation,
  useGetUserQuery,
  useGetMyReviewsQuery,
  useGetMyCommentsQuery,
} = singleUserApi;
