import { styles } from "@/app/styles/style";
import {
    useEditLayoutMutation,
    useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type Category = {
  _id: string;
  title: string;
};

type Props = {};

const EditCategories = (props: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();

  useEffect(() => {
    if (data && data.layout && data.layout.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  useEffect(() => {
    if (layoutSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message || "An error occurred");
      }
    }
  }, [error, layoutSuccess, refetch]);

  const handleCategoryChange = (id: string, value: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === id ? { ...category, title: value } : category
      )
    );
  };

  const newCategoryHandler = () => {
    const lastCategory = categories[categories.length - 1];
    if (lastCategory && lastCategory.title.trim() === "") {
      toast.error("Please enter a title for the last category before adding a new one");
    } else {
      const newId = Date.now().toString();
      setCategories((prevCategories) => [
        ...prevCategories,
        { _id: newId, title: "" },
      ]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: Category[] | undefined,
    newCategories: Category[]
  ) => {
    if (!originalCategories) return false;
    if (originalCategories.length !== newCategories.length) return false;
    return originalCategories.every((origCat, index) => 
      origCat.title === newCategories[index].title
    );
  };

  const isAnyCategoryTitleEmpty = (categories: Category[]) => {
    return categories.some((category) => category.title.trim() === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data?.layout?.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      try {
        await editLayout({
          type: "Categories",
          categories: categories,
        }).unwrap();
      } catch (err) {
        toast.error("Failed to update categories");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-[120px] text-center">
      <h1 className={`${styles.title}`}>All Categories</h1>
      {categories.map((category: Category) => (
        <div className="p-3" key={category._id}>
          <div className="flex items-center w-full justify-center">
            <input
              className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
              value={category.title}
              onChange={(e) => handleCategoryChange(category._id, e.target.value)}
              placeholder="Enter category title..."
            />
            <AiOutlineDelete
              className="dark:text-white text-black text-[18px] cursor-pointer"
              onClick={() => {
                setCategories((prevCategories) =>
                  prevCategories.filter((c) => c._id !== category._id)
                );
              }}
            />
          </div>
        </div>
      ))}
      <br />
      <br />
      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newCategoryHandler}
        />
      </div>
      <div
        className={`${
          styles.button
        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
            ${
              areCategoriesUnchanged(data?.layout?.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            }
            !rounded absolute bottom-12 right-12`}
        onClick={
          areCategoriesUnchanged(data?.layout?.categories, categories) ||
          isAnyCategoryTitleEmpty(categories)
            ? () => null
            : editCategoriesHandler
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditCategories;