import { createBrowserRouter, redirect } from "react-router-dom";
import LandingPage from "../pages/Landing";
import ManagerHomePage from "../pages/Manager/Home";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";
import SuccesCheckoutPage from "../pages/SuccesCheckout";
import LayoutDashboard from "../components/Layout";
import ManageCoursePage from "../pages/Manager/Courses";
import ManageCreateCoursePage from "../pages/Manager/Create-Courses";
import ManageCourseDetailPage from "../pages/Manager/Courses-Detail";
import ManageCourseContentCreatePage from "../pages/Manager/Course-Content-Create";
import ManageCoursePreviewPage from "../pages/Manager/Course-Preview";
import ManageStudentsPage from "../pages/Manager/Students";
import CategoriesPage from "../pages/Manager/Categories";
import SubscriptionPage from "../pages/Manager/Subscription";
import RewardsPage from "../pages/Manager/Rewards";
import SettingsPage from "../pages/Manager/Settings";
import StudentSettingsPage from "../pages/Manager/Settings";
import StudentSubscriptionPage from "../pages/Shared/Subscription";
import StudentRewardsPage from "../pages/Shared/Rewards";
import OrdersApproval from "../pages/Admin/OrdersApproval";
import CreateAdmin from "../pages/Admin/CreateAdmin";
import StudentPage from "../pages/Student/StudentOverview";
import { MANAGER_SESSION, STRORAGE_KEY, STUDENT_SESSION } from "../utils/const";
import secureLocalStorage from "react-secure-storage";
import { getCategories, getCourseDetail, getCourses, getDetailContent, getStudentsCourse } from "../services/courseService";
import { getCategories as getCategoriesList } from "../services/categoryService";
import { getSubscriptions } from "../services/subscriptionService";
import { getRewards } from "../services/rewardService";
import ManageStudentCreatePage from "../pages/Manager/Student-Create";
import { getCoursesStudents, getDetailStudent, getStudents } from "../services/studentServices";
import StudentsCourseList from "../pages/Manager/Student-Course";
import StudentForm from "../pages/Manager/Student-Course/student-form";
import { getOverviews } from "../services/overvieService";
import PublicCourseDetail from "../pages/PublicCourseDetail";
import PublicCourses from "../pages/PublicCourses";
import Checkout from "../pages/Checkout";
import TeacherApply from "../pages/TeacherApply";

import HelpCenter from "../pages/Support/HelpCenter";
import TermsOfService from "../pages/Support/TermsOfService";
import PrivacyPolicy from "../pages/Support/PrivacyPolicy";
import ContactUs from "../pages/Support/ContactUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/support/help",
    element: <HelpCenter />
  },
  {
    path: "/support/terms",
    element: <TermsOfService />
  },
  {
    path: "/support/privacy",
    element: <PrivacyPolicy />
  },
  {
    path: "/support/contact",
    element: <ContactUs />
  },
  {
    path: "/courses",
    element: <PublicCourses />
  },
  {
    path: "/courses/:id",
    loader: async ({ params }) => {
      // Allow fetching without token for public access. If getCourseDetail needs a non-auth version, we handle it in mock.
      // But getCourseDetail uses apiInstanceAuth which might fail without a token unless we mock it correctly.
      try {
        const course = await getCourseDetail(params.id);
        return course?.data;
      } catch (e) {
        return null;
      }
    },
    element: <PublicCourseDetail />
  },
  {
    path: "/checkout/:id",
    element: <Checkout />
  },
  {
    path: "/sign-in",
    loader: async () => {
      const session = secureLocalStorage.getItem(STRORAGE_KEY);
      if (session) {
        if (session.role === "manager") throw redirect("/manager");
        if (session.role === "student") throw redirect("/student");
      }
      return true;
    },
    element: <SignInPage />
  },
  {
    path: "/sign-up",
    loader: async () => {
      const session = secureLocalStorage.getItem(STRORAGE_KEY);
      if (session) {
        if (session.role === "manager") throw redirect("/manager");
        if (session.role === "student") throw redirect("/student");
      }
      return true;
    },
    element: <SignUpPage />
  },
  {
    path: "/success-checkout",
    element: <SuccesCheckoutPage />
  },
  {
    path: "/teacher/apply",
    element: <TeacherApply />
  },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async () => {
      const session = secureLocalStorage.getItem(STRORAGE_KEY);
      const allowedRoles = ["teacher", "admin", "super_admin", "manager"];
      if (!session || !allowedRoles.includes(session.role)) {
        throw redirect("/sign-in");
      }
      return session;
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        loader: async () => {
          const overviews = await getOverviews();
          return overviews?.data;
        },
        element: <ManagerHomePage />
      },
      {
        path: "courses",
        loader: async () => {
          const data = await getCourses();
          return data;
        },
        element: <ManageCoursePage />
      },
      {
        path: "courses/create",
        loader: async () => {
          const categories = await getCategories();
          return { categories, course: null };
        },
        element: <ManageCreateCoursePage />
      },
      {
        path: "courses/edit/:id",
        loader: async ({ params }) => {
          const categories = await getCategories();
          const course = await getCourseDetail(params.id);
          return { categories, course: course?.data ?? null };
        },
        element: <ManageCreateCoursePage />
      },
      {
        path: "courses/:id",
        loader: async ({ params }) => {
          const course = await getCourseDetail(params.id);
          return course?.data;
        },
        element: <ManageCourseDetailPage />
      },
      {
        path: "courses/:id/create",
        element: <ManageCourseContentCreatePage />
      },
      {
        path: "courses/:id/edit/:contentId",
        loader: async ({ params }) => {
          const content = await getDetailContent(params.contentId);
          return content?.data;
        },
        element: <ManageCourseContentCreatePage />
      },
      {
        path: "courses/:id/preview",
        loader: async ({ params }) => {
          const course = await getCourseDetail(params.id, true);
          return course?.data;
        },
        element: <ManageCoursePreviewPage />
      },
      {
        path: "/manager/students",
        loader: async () => {
          const students = await getStudents();
          return students?.data;
        },
        element: <ManageStudentsPage />
      },
      {
        path: "/manager/students/create",
        element: <ManageStudentCreatePage />
      },
      {
        path: "/manager/students/edit/:id",
        loader: async ({ params }) => {
          const student = await getDetailStudent(params.id);
          return student?.data;
        },
        element: <ManageStudentCreatePage />
      },
      {
        path: "/manager/courses/students/:id",
        loader: async ({ params }) => {
          const course = await getStudentsCourse(params.id);
          return course?.data;
        },
        element: <StudentsCourseList />
      },
      {
        path: "/manager/courses/students/:id/add",
        loader: async () => {
          const students = await getStudents();
          return students?.data;
        },
        element: <StudentForm />
      },
      {
        path: "/manager/categories",
        loader: async () => {
          const categories = await getCategoriesList();
          return categories;
        },
        element: <CategoriesPage />
      },
      {
        path: "/manager/subscription",
        loader: async () => {
          const subscriptions = await getSubscriptions();
          return subscriptions;
        },
        element: <SubscriptionPage />
      },
      {
        path: "/manager/rewards",
        loader: async () => {
          const rewards = await getRewards();
          return rewards;
        },
        element: <RewardsPage />
      },
      {
        path: "/manager/settings",
        element: <SettingsPage />
      },
      {
        path: "/manager/admin/orders",
        element: <OrdersApproval />
      },
      {
        path: "/manager/admin/users",
        element: <CreateAdmin />
      }
    ]
  },
  {
    path: "/student",
    id: STUDENT_SESSION,
    loader: async () => {
      const session = secureLocalStorage.getItem(STRORAGE_KEY);
      if (!session || session.role !== "student") {
        throw redirect("/sign-in");
      }
      return session;
    },
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        loader: async () => {
          const courses = await getCoursesStudents();
          return courses?.data;
        },
        element: <StudentPage />
      },
      {
        path: "/student/detail-course/:id",
        loader: async ({ params }) => {
          const course = await getCourseDetail(params.id, true);
          return course?.data;
        },
        element: <ManageCoursePreviewPage isAdmin={false} />
      },
      {
        path: "/student/subscription",
        loader: async () => {
          const subscriptions = await getSubscriptions();
          return subscriptions?.data || [];
        },
        element: <StudentSubscriptionPage />
      },
      {
        path: "/student/rewards",
        loader: async () => {
          const rewards = await getRewards();
          return rewards?.data || [];
        },
        element: <StudentRewardsPage />
      },
      {
        path: "/student/settings",
        element: <StudentSettingsPage />
      }
    ]
  }
]);

export default router;
