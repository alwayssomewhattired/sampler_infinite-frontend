import api from "../../store/api";

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    aboutHim: builder.query({
      query: (profileId) => ({
        url: `/api/users/aboutHim/${profileId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useAboutHimQuery } = usersApi;
