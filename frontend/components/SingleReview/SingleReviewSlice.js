import api from "../../store/api";

const singleReviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReview: builder.query({
      query: ({ audioId, reviewId }) => ({
        url: `api/reviews/${audioId}/reviews/${reviewId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useGetReviewQuery } = singleReviewApi;
