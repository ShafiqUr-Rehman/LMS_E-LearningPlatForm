import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetAllOrdersQuery } from "@/redux/features/orders/orderApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";

type OrderData = {
  _id: string;
  userId: string;
  courseId: string;
  createdAt: string;
};

type UserData = {
  _id: string;
  name: string;
  email: string;
};

type CourseData = {
  _id: string;
  name: string;
  price: number;
};

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const { isLoading, data: orderData } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [rows, setRows] = useState<any[]>([]);




  useEffect(() => {
    if (orderData && usersData && coursesData) {
      const orders: OrderData[] = orderData.orders || [];
      const users: UserData[] = usersData.users || [];
      const courses: CourseData[] = coursesData.courses || [];
  
      // Log to verify the data being processed
      console.log('Orders:', orders);
      console.log('Users:', users);
      console.log('Courses:', courses);
  
      const formattedRows = orders.map((order) => {
        const user = users.find((user) => user._id === order.userId);
        const course = courses.find((course) => course._id === order.courseId);
  
        console.log('Order:', order); // Log order data
        console.log('Matching Course:', course); // Log the course found
  
        return {
          id: order._id,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "Unknown Email",
          title: course ? course.name : "Unknown Course", // Ensure course is valid
          price: course ? `$${course.price}` : "N/A", // Ensure price is valid
          created_at: format(order.createdAt), // Format date
        };
      });
  
      setRows(formattedRows);
    }
  }, [orderData, usersData, coursesData]);
  



  
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: "emailAction",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => (
              <a href={`mailto:${params.row.userEmail}`}>
                <AiOutlineMail
                  className="dark:text-white text-black"
                  size={20}
                />
              </a>
            ),
          },
        ]),
  ];

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          <Box
            m={isDashboard ? "0" : "40px 0 0 0"}
            height={isDashboard ? "35vh" : "82.49vh"}
            overflow="hidden"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? `#b7ebde !important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              slots={isDashboard ? undefined : { toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
