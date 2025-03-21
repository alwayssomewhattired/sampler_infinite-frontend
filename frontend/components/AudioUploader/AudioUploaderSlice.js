import api from "../../store/api";

const audioUploaderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postAudio: builder.mutation({
      query: ({ id, user, name, description }) => ({
        url: `api/items/${id}/${user}/${name}`,
        method: "POST",
        body: { description },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { usePostAudioMutation } = audioUploaderApi;
