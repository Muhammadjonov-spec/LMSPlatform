import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLoaderData, useMatch } from "react-router-dom";

export default function LayoutDashboard({ isAdmin = true }) {
  const session = useLoaderData();
  const isManagerPreviewPage = useMatch("/manager/courses/:id/preview");
  const isStudentPreviewPage = useMatch("/student/detail-course/:id");

  const isPreviewPage = isManagerPreviewPage || isStudentPreviewPage;

  return (
    <>
      {isPreviewPage ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen">
          <Sidebar isAdmin={isAdmin} />
          <main className="flex flex-col flex-1 gap-[30px] p-[30px] ml-[290px]">
            <Header type={session?.role} />
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
