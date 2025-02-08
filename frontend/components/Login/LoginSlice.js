import api from "../../store/api";

const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addLogin: builder.mutation({
      //I got rid of "first_name, last_name" in query because I don't think it's necessary
      query: ({ email, password }) => ({
        url: "api/users/login",
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const { useAddLoginMutation } = loginApi;
