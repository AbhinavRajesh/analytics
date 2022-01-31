import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";

import Layout from "@components/Layout";
import Navbar from "@components/Navbar";
import { useAuth } from "hooks/useAuth";
import Create from "@components/Create";

const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch("/api/url", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => await res.json());
      console.log(response);
    } catch (error) {}
  };

  return (
    <Layout>
      <Navbar />
      <Create />
      This is cool
    </Layout>
  );
};

export default Home;
