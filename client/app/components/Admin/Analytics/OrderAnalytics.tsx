import { styles } from "@/app/styles/style";
import { useGetOrderAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  const { data, isLoading } = useGetOrderAnalyticsQuery({});

  // Debug: Log the data from the API to check if it's returning correctly
  console.log("Fetched order data from API:", data);

  // Prepare data for the chart
  const orderAnalyticsData =
    data?.orders?.last12Months?.map((item: any) => ({
      name: item.name, // Month-Year (e.g., "Dec 2024")
      count: item.count, // Order count
    })) || [];

  // Debug: Log the orderAnalyticsData before passing it to the chart
  console.log("Order Analytics Data:", orderAnalyticsData);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
          <div
            className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}
          >
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Orders Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data
              </p>
            )}
          </div>
          
          <div
            className={`w-full ${
              !isDashboard ? "h-[90%]" : "h-full"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "50%"}
            >
              <LineChart
                width={500}
                height={300}
                data={orderAnalyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
