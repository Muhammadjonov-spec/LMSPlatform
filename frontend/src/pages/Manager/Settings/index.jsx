import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { MANAGER_SESSION, STUDENT_SESSION } from "../../../utils/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faCamera, faServer } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  const managerSession = useRouteLoaderData(MANAGER_SESSION);
  const studentSession = useRouteLoaderData(STUDENT_SESSION);
  const session = managerSession || studentSession;

  // Profile data
  const fullName = session?.firstName && session?.lastName
    ? `${session.firstName} ${session.lastName}`
    : session?.firstName || session?.name || "User";

  const [profileData, setProfileData] = useState({
    firstName: session?.firstName || session?.name?.split(" ")[0] || "",
    lastName: session?.lastName || session?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.email || "",
    phone: session?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // System settings data (only for super_admin)
  const [systemData, setSystemData] = useState({
    platformName: "EduStack LMS",
    supportEmail: "support@edustack.uz",
    allowRegistration: true,
    requireEmailVerification: false
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [saveMessage, setSaveMessage] = useState("");

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveMessage("Profile data saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      setSaveMessage("New passwords do not match!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    if (profileData.newPassword.length < 6) {
      setSaveMessage("Password must be at least 6 characters long!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    setSaveMessage("Password changed successfully!");
    setProfileData({ ...profileData, currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSystemSave = (e) => {
    e.preventDefault();
    setSaveMessage("System settings saved!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: faUser },
    { id: "security", label: "Security", icon: faLock }
  ];

  if (session?.role === 'super_admin') {
    tabs.push({ id: "system", label: "System", icon: faServer });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your personal account {session?.role === 'super_admin' ? "and system settings" : ""}
        </p>
      </div>

      {saveMessage && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
          saveMessage.includes("successfully") || saveMessage.includes("saved")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#1E40AF] text-[#1E40AF] dark:text-[#3b82f6]"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/10 flex items-center gap-6">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
                  style={{ backgroundColor: `hsl(${(fullName).charCodeAt(0) * 7 % 360}, 70%, 60%)` }}
                >
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#1E40AF] text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-800 transition-colors">
                  <FontAwesomeIcon icon={faCamera} className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{fullName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{session?.email || "email@example.com"}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[#1E40AF] dark:text-blue-300 text-xs font-semibold rounded-md uppercase">
                  {session?.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="inline-flex justify-center rounded-lg bg-[#1E40AF] py-2.5 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSave} className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="inline-flex justify-center rounded-lg bg-[#1E40AF] py-2.5 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "system" && session?.role === 'super_admin' && (
          <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <form onSubmit={handleSystemSave} className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-white/10 pb-2 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform Name</label>
                    <input
                      type="text"
                      value={systemData.platformName}
                      onChange={(e) => setSystemData({...systemData, platformName: e.target.value})}
                      className="block w-full rounded-md border-gray-300 dark:border-white/20 shadow-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email Address</label>
                    <input
                      type="email"
                      value={systemData.supportEmail}
                      onChange={(e) => setSystemData({...systemData, supportEmail: e.target.value})}
                      className="block w-full rounded-md border-gray-300 dark:border-white/20 shadow-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white sm:text-sm py-2 px-3 border"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-white/10 pb-2 mb-4">Security and Permissions</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="allowRegistration"
                        type="checkbox"
                        checked={systemData.allowRegistration}
                        onChange={(e) => setSystemData({...systemData, allowRegistration: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allowRegistration" className="font-medium text-gray-700 dark:text-gray-300">Students can register</label>
                      <p className="text-gray-500">New students can create their own accounts on the platform.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="requireVerification"
                        type="checkbox"
                        checked={systemData.requireEmailVerification}
                        onChange={(e) => setSystemData({...systemData, requireEmailVerification: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireVerification" className="font-medium text-gray-700 dark:text-gray-300">Email verification required</label>
                      <p className="text-gray-500">Login is disabled until the email is verified after registration.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="inline-flex justify-center rounded-md bg-[#1E40AF] py-2 px-6 text-sm font-medium text-white hover:bg-blue-800">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
