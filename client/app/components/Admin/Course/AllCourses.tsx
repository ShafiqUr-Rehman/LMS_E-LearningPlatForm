import { styles } from "@/app/styles/style";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success(`Course deleted successfully`);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [error, isSuccess, refetch]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchase", headerName: "purchase", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Link href={`/admin/edit-course/${params.row.id}`}>
              <FiEdit2 className="dark:text-white text-black" size={20} />
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setCourseId(params.row.id);
              }}
            >
              <AiOutlineDelete
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  {
    data &&
      data.courses.forEach((course: any) =>
        rows.push({
          id: course._id,
          title: course.name,
          ratings: course.ratings,
          purchase: course.purchase,
          created_at: format(course.createdAt),
        })
      );
  }

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box
        m="40px 0 0 0"
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC", // Background color with theme check
            borderBottom: "none",
            color: theme === "dark" ? "#E2E8F0" : "#000000", // Text color for column headers
            fontWeight: "bold",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0", // Virtual scroller background color
          },
          "& .MuiDataGrid-footerContainer": {
            color: theme === "dark" ? "#E2E8F0" : "#000000", // Footer text color
            borderTop: "none",
            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC", // Footer background color
          },
          "& .MuiDataGrid-row": {
            color: theme === "dark" ? "#ffffff" : "#000000", // Row text color
            borderBottom:
              theme === "dark"
                ? "1px solid #ffffff30"
                : "1px solid #ccc", // Border color for rows
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
      
      )}
    </div>
  );
};

export default AllCourses;
