import api from "../../store/api";

const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (token) => ({
        url: "/api/users/allUsers",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["User"],
    }),
    aboutMe: builder.query({
      query: (token) => ({
        url: "/api/users/aboutMe",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    delete: builder.mutation({
      query: ({ token, id }) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useAboutMeQuery, useDeleteMutation } = homeApi;
