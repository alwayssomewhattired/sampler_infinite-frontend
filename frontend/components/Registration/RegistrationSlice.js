import api from "../../store/api";

const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: ({ first_name, last_name, email, password }) => ({
        url: "api/users/register",
        method: "POST",
        body: { first_name, last_name, email, password },
      }),
    }),
  }),
});

export const { useAddUserMutation } = registerApi;