import api from "../../store/api";

const audiosUploaderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postAudios: builder.mutation({
      query: ({ user, chosenAudio, name, description }) => ({
        url: `api/items/sampledinfinitepack`,
        method: "POST",
        body: { user, chosenAudio, name, description },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

// export const tagStripper = async (audioName) => {
//   try {
//     const response = await fetch(import.meta.env.VITE_SERVERLESS_HTTP_API, {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({
//         object_name: audioName,
//       }),
//     });
//     const data = await response.json();
//   } catch (error) {
//     console.error(error);
//   }
// };

export const { usePostAudiosMutation } = audiosUploaderApi;
