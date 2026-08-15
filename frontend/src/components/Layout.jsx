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
        <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Sidebar isAdmin={isAdmin} />
          <main className="flex flex-col flex-1 gap-[30px] p-[15px] md:p-[30px] md:ml-[290px] w-full transition-all duration-300">
            <Header type={session?.role} />
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
