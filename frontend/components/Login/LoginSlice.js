import api from "../../store/api";

const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addLogin: builder.mutation({
      query: ({ first_name, last_name, email, password }) => ({
        url: "api/users/login",
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const { useAddLoginMutation } = loginApi;
