import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { MANAGER_SESSION } from "../../../utils/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faCamera, faServer } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  const session = useRouteLoaderData(MANAGER_SESSION);

  // Profile data
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
    setSaveMessage("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      setSaveMessage("Yangi parollar mos kelmaydi!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    if (profileData.newPassword.length < 6) {
      setSaveMessage("Parol kamida 6 belgidan iborat bo'lishi kerak!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    setSaveMessage("Parol muvaffaqiyatli o'zgartirildi!");
    setProfileData({ ...profileData, currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSystemSave = (e) => {
    e.preventDefault();
    setSaveMessage("Tizim sozlamalari saqlandi!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: faUser },
    { id: "security", label: "Xavfsizlik", icon: faLock }
  ];

  if (session?.role === 'super_admin') {
    tabs.push({ id: "system", label: "Tizim", icon: faServer });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sozlamalar</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Shaxsiy hisobingiz {session?.role === 'super_admin' ? "va tizim sozlamalarini" : ""} boshqaring
        </p>
      </div>

      {saveMessage && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
          saveMessage.includes("muvaffaqiyatli") || saveMessage.includes("saqlandi")
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
                  style={{ backgroundColor: `hsl(${(session?.name || "U").charCodeAt(0) * 7 % 360}, 70%, 60%)` }}
                >
                  {session?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#1E40AF] text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-800 transition-colors">
                  <FontAwesomeIcon icon={faCamera} className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{session?.name || "Foydalanuvchi"}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{session?.email || "email@example.com"}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[#1E40AF] dark:text-blue-300 text-xs font-semibold rounded-md uppercase">
                  {session?.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ism</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Familiya</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email manzil</label>
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Parolni o'zgartirish</h3>
            </div>
            <form onSubmit={handlePasswordSave} className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Joriy parol</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yangi parol</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parolni tasdiqlang</label>
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
                  Parolni o'zgartirish
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "system" && session?.role === 'super_admin' && (
          <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <form onSubmit={handleSystemSave} className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-white/10 pb-2 mb-4">Asosiy Ma'lumotlar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platforma nomi</label>
                    <input
                      type="text"
                      value={systemData.platformName}
                      onChange={(e) => setSystemData({...systemData, platformName: e.target.value})}
                      className="block w-full rounded-md border-gray-300 dark:border-white/20 shadow-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qo'llab-quvvatlash Email manzili</label>
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-white/10 pb-2 mb-4">Xavfsizlik va Ruxsatlar</h3>
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
                      <label htmlFor="allowRegistration" className="font-medium text-gray-700 dark:text-gray-300">O'quvchilar ro'yxatdan o'ta oladi</label>
                      <p className="text-gray-500">Yangi o'quvchilar platformada o'zlari akkaunt yarata oladilar.</p>
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
                      <label htmlFor="requireVerification" className="font-medium text-gray-700 dark:text-gray-300">Emailni tasdiqlash majburiy</label>
                      <p className="text-gray-500">Ro'yxatdan o'tgandan keyin email tasdiqlanmaguncha tizimga kirish taqiqlanadi.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="inline-flex justify-center rounded-md bg-[#1E40AF] py-2 px-6 text-sm font-medium text-white hover:bg-blue-800">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
