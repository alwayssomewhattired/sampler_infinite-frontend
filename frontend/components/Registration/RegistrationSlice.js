import api from "../../store/api";

const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: ({ username, email, normal_password, photoId }) => ({
        url: "api/users/register",
        method: "POST",
        body: { username, email, normal_password, photoId },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useAddUserMutation } = registerApi;
