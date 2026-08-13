import React from "react";
import { Users, BookOpen, DollarSign, Activity, TrendingUp } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function OverviewPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const stats = [
    { title: "Total Students", value: "2,543", change: "+12.5%", isPositive: true, icon: Users, color: "blue" },
    { title: "Active Courses", value: "124", change: "+4.2%", isPositive: true, icon: BookOpen, color: "indigo" },
    { title: "Total Revenue", value: "$45,231", change: "+18.2%", isPositive: true, icon: DollarSign, color: "emerald" },
    { title: "Engagement", value: "89%", change: "-2.4%", isPositive: false, icon: Activity, color: "purple" }
  ];

  return (
    <div className="w-full py-6 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-500 mt-2">Here is what's happening with your platform today.</p>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`w-4 h-4 ${!stat.isPositive && "rotate-180"}`} /> {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Activity / Charts Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h2>
          <div className="flex-1 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100/50 flex flex-col items-center justify-end p-8 gap-4 border border-dashed border-gray-200">
            {/* Fake Chart Bars */}
            <div className="w-full h-48 flex items-end justify-between gap-2 px-4">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <div key={i} className="w-full bg-blue-500/20 rounded-t-lg relative group cursor-pointer hover:bg-blue-500/40 transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(h * 123).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-between text-xs font-semibold text-gray-400 px-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Users</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  U{i}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">User Name {i}</h4>
                  <p className="text-xs text-gray-500">Joined 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
