import api from "../../store/api";

const packGetterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPack: builder.query({
      query: ({ packId }) => ({
        url: `api/items/pack/${packId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useGetPackQuery } = packGetterApi;
