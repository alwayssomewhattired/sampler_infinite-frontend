import api from "../../store/api";

const singleUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyReviews: builder.query({
      query: () => ({
        url: "/api/reviews/me",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
    getMyComments: builder.query({
      query: () => ({
        url: `api/comments/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    }),
  }),
});

export const { useGetMyReviewsQuery, useGetMyCommentsQuery } = singleUserApi;
