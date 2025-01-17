import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseAnalytics: builder.query({
      query: () => ({
        url: "get-course-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUserAnalytics: builder.query({
      query: () => ({
        url: "get-user-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrderAnalytics: builder.query({ // Singular "Order" for consistency
      query: () => ({
        url: "get-order-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCourseAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useGetOrderAnalyticsQuery, // Updated name
} = analyticsApi;
