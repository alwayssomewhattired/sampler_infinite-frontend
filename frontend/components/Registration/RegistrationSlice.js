import api from "../../store/api";

const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: ({ first_name, last_name, email, normal_password }) => ({
        url: "api/users/register",
        method: "POST",
        body: { first_name, last_name, email, normal_password },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useAddUserMutation } = registerApi;
