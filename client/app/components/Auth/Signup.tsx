"use client";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import { styles } from "../../../app/styles/style";

type Props = {
  setRoute: (route: string) => void;
};

// Form validation schema using Yup
const Schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required").min(8),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false); // State to toggle password visibility
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  // Handle side effects based on API responses
  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration Successful";
      toast.success(message);
      setRoute("Verification"); // Redirect to verification route
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData.data.message);
    }
  }, [isSuccess, error, data?.message, setRoute]);

  // Initialize formik for form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Schema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password };
      await register(data); // Call register API
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
      <h1 className={`${styles.title} text-center`}>Join ELearning</h1>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mt-5">
          <label className={`${styles.label}`} htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="John Doe"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        {/* Email Input */}
        <div className="mt-5">
          <label className={`${styles.label}`} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Password Input */}
        <div className="mt-5 relative">
          <label className={`${styles.label}`} htmlFor="password">
            Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password@#!&"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-3 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-3 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-5">
          <input
            type="submit"
            value="Sign Up"
            className={`${styles.button} w-full bg-blue-600 hover:bg-blue-700 text-white`}
          />
        </div>

        {/* Alternative Signup Options */}
        <div className="text-center mt-5">
          <h5 className="font-medium text-gray-600 dark:text-gray-300">
            Or join with
          </h5>
          <div className="flex justify-center items-center mt-3">
            <FcGoogle
              size={30}
              className="cursor-pointer mx-2"
              onClick={() => console.log("Google Signup")}
            />
            <AiFillGithub
              size={30}
              className="cursor-pointer mx-2"
              onClick={() => console.log("Github Signup")}
            />
          </div>
        </div>

        {/* Login Redirect */}
        <h5 className="text-center mt-5 text-sm font-medium text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            className="text-blue-600 dark:text-blue-400 cursor-pointer underline"
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Signup;
