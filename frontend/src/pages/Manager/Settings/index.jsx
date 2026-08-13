import React, { useState } from "react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    platformName: "EduStack LMS",
    supportEmail: "support@edustack.uz",
    allowRegistration: true,
    requireEmailVerification: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Sozlamalar muvaffaqiyatli saqlandi! (Mock)");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="mt-2 text-sm text-gray-700">Platformaning umumiy sozlamalarini boshqarish</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl">
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Asosiy Ma'lumotlar</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Platforma nomi</label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={formData.platformName}
                    onChange={(e) => setFormData({...formData, platformName: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2 px-3 border"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Qo'llab-quvvatlash Email manzili</label>
                <div className="mt-1">
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] sm:text-sm py-2 px-3 border"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Xavfsizlik va Ruxsatlar</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="allowRegistration"
                    type="checkbox"
                    checked={formData.allowRegistration}
                    onChange={(e) => setFormData({...formData, allowRegistration: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowRegistration" className="font-medium text-gray-700">O'quvchilar ro'yxatdan o'ta oladi</label>
                  <p className="text-gray-500">Yangi o'quvchilar platformada o'zlari akkaunt yarata oladilar.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="requireVerification"
                    type="checkbox"
                    checked={formData.requireEmailVerification}
                    onChange={(e) => setFormData({...formData, requireEmailVerification: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="requireVerification" className="font-medium text-gray-700">Emailni tasdiqlash majburiy</label>
                  <p className="text-gray-500">Ro'yxatdan o'tgandan keyin email tasdiqlanmaguncha tizimga kirish taqiqlanadi.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#1E40AF] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
