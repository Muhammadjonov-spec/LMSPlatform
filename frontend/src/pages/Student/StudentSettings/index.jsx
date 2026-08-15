import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { STUDENT_SESSION } from "../../../utils/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";

export default function StudentSettingsPage() {
  const session = useRouteLoaderData(STUDENT_SESSION);

  const [formData, setFormData] = useState({
    firstName: session?.firstName || session?.name?.split(" ")[0] || "",
    lastName: session?.lastName || session?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.email || "",
    phone: session?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveMessage("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveMessage("Yangi parollar mos kelmaydi!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    if (formData.newPassword.length < 6) {
      setSaveMessage("Parol kamida 6 belgidan iborat bo'lishi kerak!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    setSaveMessage("Parol muvaffaqiyatli o'zgartirildi!");
    setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: faUser },
    { id: "security", label: "Xavfsizlik", icon: faLock }
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sozlamalar</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Shaxsiy ma'lumotlaringizni boshqaring
        </p>
      </div>

      {/* Success/Error Message */}
      {saveMessage && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
          saveMessage.includes("muvaffaqiyatli")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
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
            {/* Avatar section */}
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
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[#1E40AF] dark:text-blue-300 text-xs font-semibold rounded-md">
                  {session?.role || "student"}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-1 text-gray-400" />
                    Ism
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                    placeholder="Ismingiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Familiya
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                    placeholder="Familiyangiz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-1 text-gray-400" />
                  Email manzil
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  placeholder="Email manzilingiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefon raqam
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  placeholder="+998 90 123 45 67"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-lg bg-[#1E40AF] py-2.5 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2 transition-colors"
                >
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hisobingiz xavfsizligini ta'minlash uchun kuchli parol tanlang</p>
            </div>

            <form onSubmit={handlePasswordSave} className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Joriy parol
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  placeholder="Hozirgi parolingiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yangi parol
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  placeholder="Yangi parol (kamida 6 belgi)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yangi parolni tasdiqlash
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2.5 px-3 text-gray-900 dark:text-white"
                  placeholder="Yangi parolni qayta kiriting"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-lg bg-[#1E40AF] py-2.5 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2 transition-colors"
                >
                  Parolni o'zgartirish
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
