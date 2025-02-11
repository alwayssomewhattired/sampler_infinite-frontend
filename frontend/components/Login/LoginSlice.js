import api from "../../store/api";

const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addLogin: builder.mutation({
      query: ({ email, normal_password }) => ({
        url: "api/users/login",
        method: "POST",
        body: { email, normal_password },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useAddLoginMutation } = loginApi;
