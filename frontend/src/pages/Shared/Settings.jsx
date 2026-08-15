import React from "react";
import { User, Mail, Lock, Bell, Moon, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your profile, preferences, and security.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar inside settings */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6">
          <nav className="flex flex-col space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow-sm border border-gray-100">
              <User className="w-5 h-5 text-blue-500" /> Profile
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              <Lock className="w-5 h-5" /> Security
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              <Bell className="w-5 h-5" /> Notifications
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              <Moon className="w-5 h-5" /> Appearance
            </a>
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 p-8 md:p-10">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {user?.firstName?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-500">{user?.role?.toUpperCase()} Account</p>
              <button className="mt-3 px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Change Avatar</button>
            </div>
          </div>

          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" defaultValue={user?.firstName} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" defaultValue={user?.lastName} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" defaultValue={user?.email} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all">Save Changes</button>
              
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
