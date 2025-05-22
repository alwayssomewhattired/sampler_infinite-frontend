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
    updateEmail: builder.mutation({
      query: ({ token, id, email }) => ({
        url: `/api/users/${id}/email`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id,
          email,
        }),
      }),
      invalidatesTags: ["User"],
    }),
    updateUsername: builder.mutation({
      query: ({ token, id, username }) => ({
        url: `/api/users/${id}/username`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id,
          username,
        }),
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: ({ token, id, normal_password }) => ({
        url: `/api/users/${id}/password`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id,
          normal_password,
        }),
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateEmailMutation,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
} = singleUserApi;
