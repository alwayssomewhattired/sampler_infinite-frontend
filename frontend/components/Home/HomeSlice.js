import api from "../../store/api";

const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (token) => ({
        url: "/api/users/allUsers",
        methods: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
      //might need to add 'providesTags' here
    }),
    //definitely need to provide tags for delete
    delete: builder.mutation({
      query: ({ token, id }) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetUsersQuery, useDeleteMutation } = homeApi;
