import AdminList from "../../components/User/AdminList";
import React, { useEffect } from "react";
import Router from "next/router";
import { useCookies } from "react-cookie";
import Layout from "../../components/layout";

export default function AdminPage() {
  useEffect(() => {
    if (sessionStorage.getItem("nickname") != "admin") {
      alert("접근 권한이 없습니다");
      Router.push("/");
    }
  }, []);

  return (
    <Layout>
       <h1>회원관리</h1>
      <AdminList />
    </Layout>
  );
}
