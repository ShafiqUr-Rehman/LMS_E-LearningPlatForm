import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
  useUpdateAvatarMutation,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import avatarDefault from "../../../public/assets/Profile.png";

type Props = {
  user: any;
  avatar: string | null;
};

const ProfileInfo: React.FC<Props> = ({ user, avatar }) => {
  // State to manage user name input
  const [name, setName] = React.useState(user && user.name);

  // Mutation hooks for updating avatar and user details
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [updateUser, { isSuccess: success, error: updateUserError }] =
    useUpdateUserMutation();

  // State to determine whether to refetch user data
  const [shouldFetch, setShouldFetch] = React.useState(false);

  // Query hook to fetch user data with conditional fetching
  const { refetch, isFetching } = useLoadUserQuery(undefined, {
    skip: !shouldFetch, // Only run when shouldFetch is true
  });

  // Handle file input change for updating avatar
  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar); // Update avatar using mutation
      }
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };

  // Effect to handle avatar update success or error
  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Avatar updated successfully");
      setShouldFetch(true); // Trigger refetch after update
    }
    if (error) {
      console.log(error);
      toast.error("Error updating avatar");
    }
  }, [isSuccess, error]);

  // Effect to refetch user data when shouldFetch is true
  React.useEffect(() => {
    if (shouldFetch) {
      refetch(); // Fetch user data
      setShouldFetch(false); // Reset shouldFetch
    }
  }, [shouldFetch, refetch]);

  // Handle form submission for updating user details
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      const result = await updateUser({
        name: name,
      });
      if (result) {
        toast.success("Profile updated successfully");
        setShouldFetch(true); // Trigger refetch
      } else if (updateUserError) {
        toast.error("Error updating profile");
        console.log(updateUserError);
      }
    }
  };

  return (
    <>
      {/* Avatar upload and display */}
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={
              user.avatar || avatar ? user.avatar.url || avatar : avatarDefault
            }
            alt="Profile Photo"
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#30bbb2ca] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />

      {/* User details form */}
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <br />
            <div className="w-[100%] pt-2">
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                readOnly
                id="email"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={user && user.email}
              />
            </div>
            <br />
            <input
              type="submit"
              className="w-full 800px:w-[250px] h-[40px] border border-[cyan] text-center dark:text-white  rounded-[3px] mt-8 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-all duration-300 ease-in-out hover:from-blue-500 hover:to-cyan-500 hover:scale-105"
              required
              value="Update"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
