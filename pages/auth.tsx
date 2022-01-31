import Layout from "@components/Layout";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "hooks/useAuth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, provider } from "utils/firebase";

const Auth: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, []);

  const signin = async () => {
    signInWithPopup(auth, provider).then(async (result) => {
      const token = await result.user.getIdToken();
      await fetch("/api/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        const { success, message } = await res.json();
        if (success) {
          router.push("/");
        } else {
          logout();
          setError(message ?? "Some error occured. Please try again later");
        }
      });
    });
  };

  return (
    <Layout extraClasses="flex items-center justify-center flex-col h-screen">
      <div className="shadow px-[50px] py-[100px] shadow-[#5a5a5a3b] rounded flex flex-col items-start justify-center">
        <h1 className="text-center w-full font-bold text-[20px] mb-[20px]">
          ARAnalytics
        </h1>
        {error.length !== 0 && (
          <small className="bg-red-100 px-[20px] py-[10px] text-red-500 w-full mb-[20px] font-bold text-sm rounded">
            {error}
          </small>
        )}
        <button
          onClick={signin}
          className="bg-blue-500 hover:bg-blue-400 w-full mt-[20px] rounded font-semibold py-[8px] px-[16px] transition-all duration-300 ease-in"
        >
          Login
        </button>
      </div>
    </Layout>
  );
};

export default Auth;
