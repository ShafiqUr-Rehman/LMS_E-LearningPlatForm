"use client";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { styles } from "../../../app/styles/style";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error, data }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  // Handle API responses
  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Account activated successfully");
      setRoute("Login");
    }
    if (error) {
      const errorData = error as any;
      if ("data" in error) {
        toast.error(errorData.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setInvalidError(true); // Trigger shake effect
    }
  }, [isSuccess, error, data, setRoute]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  // Handle OTP verification
  const verifyHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 6) {
      setInvalidError(true); // Trigger shake effect for incomplete code
      return;
    }
    await activation({
      activationToken: token,
      activationCode: verificationNumber,
    });
  };

  // Handle input change and focus management
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false); // Reset error state on valid input
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title} text-center`}>Verify your account</h1>
      <div className="w-full flex items-center justify-center mt-6">
        <div className="w-[80px] h-[80px] rounded-full bg-blue-600 flex items-center justify-center">
          <VscWorkspaceTrusted size={40} className="text-white" />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-16 h-16 bg-transparent border-[3px] rounded-[10px] text-center text-[18px] font-Poppins outline-none text-black dark:text-white ${
              invalidError ? "shake border-red-500" : "border-gray-400"
            }`}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            maxLength={1}
          />
        ))}
      </div>
      <div className="w-full flex justify-center mt-10">
        <button
          className={`${styles.button} hover:bg-blue-700`}
          onClick={verifyHandler}
        >
          Verify OTP
        </button>
      </div>
      <h5 className="text-center mt-6 text-[14px] font-Poppins text-gray-600 dark:text-gray-300">
        Go back to Sign in?{" "}
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
