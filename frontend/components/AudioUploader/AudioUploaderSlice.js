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

export const tagStripper = async (audioName) => {
  try {
    const response = await fetch(import.meta.env.VITE_SERVERLESS_HTTP_API, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        object_name: audioName,
      }),
    });
    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const { usePostAudioMutation } = audioUploaderApi;
