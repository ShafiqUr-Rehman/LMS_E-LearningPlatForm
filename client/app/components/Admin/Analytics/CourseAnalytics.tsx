import { styles } from "@/app/styles/style";
import { useGetCourseAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";

type Props = {};

const CourseAnalytics = (props: Props) => {
  const { data, isLoading } = useGetCourseAnalyticsQuery({});

  // Prepare course analytics data for the chart
  const courseAnalyticsData: any = [];
  data?.courses?.last12Months?.forEach((item: any) => {
    courseAnalyticsData.push({
      name: item.month, // Month-Year (e.g., "Dec 2024")
      uv: item.count,   // Count of courses
    });
  });
  console.log("Prepared Analytics Data:", CourseAnalytics);

  const minValue = 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 Months Analytics Data
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="50%">
              <BarChart width={150} height={300} data={courseAnalyticsData}>
                <XAxis dataKey="name">
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey="uv" fill="#3faf82">
                  <LabelList dataKey="uv" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
