import api from "../../store/api";

const singleUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    update: builder.mutation({
      //I don't know if all of these things belong in the query
      query: ({
        token,
        id,
        first_name,
        last_name,
        email,
        normal_password,
      }) => ({
        url: `/api/users/${id}`,
        methods: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //I don't know if this is correct
          id: id,
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: normal_password,
        }),
      }),
    }),
  }),
});

export const { useUpdateMutation } = singleUserApi;
