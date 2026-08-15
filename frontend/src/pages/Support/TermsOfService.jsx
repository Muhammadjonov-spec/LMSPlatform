import React from "react";
import Navbar from "../../components/Navbar";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 border-b pb-6">Foydalanish Shartlari (Terms of Service)</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Umumiy qoidalar</h2>
              <p>
                EduStack platformasiga xush kelibsiz. Ushbu shartlar tizimdan foydalanish tartibini belgilaydi. Platformaga kirish yoki undan foydalanish orqali siz ushbu shartlarga rozi ekanligingizni bildirasiz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Akkaunt xavfsizligi</h2>
              <p>
                Foydalanuvchilar o'z akkauntlarining maxfiyligi va unda amalga oshirilgan barcha harakatlar uchun shaxsan javobgar hisoblanadilar. Birovning akkauntidan ruxsatsiz foydalanish qat'iyan man etiladi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Mualliflik huquqi</h2>
              <p>
                Platformadagi barcha kurslar, videolar, matnlar va materiallar EduStack yoki tegishli o'qituvchilarning intellektual mulki hisoblanadi. Ularni noqonuniy tarqatish yoki yuklab olib sotish qonuniy javobgarlikka tortiladi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. To'lov va qaytarish (Refund)</h2>
              <p>
                Sotib olingan kurslar uchun to'lovlar, agar foydalanuvchi kursning 20% dan ko'pini ko'rmagan bo'lsa va xarid qilinganiga 7 kun to'lmagan bo'lsa, ma'lumotlar tahlil qilinib qisman yoki to'liq qaytarib berilishi mumkin. Boshqa hollarda to'lovlar qaytarilmaydi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Shartlamalarni o'zgartirish</h2>
              <p>
                EduStack ma'muriyati istalgan vaqtda ushbu foydalanish shartlariga o'zgartirish kiritish huquqini o'zida saqlab qoladi. Muhim o'zgarishlar bo'lsa, sizning emailingizga xabar yuboriladi.
              </p>
            </section>
          </div>
          
          <div className="mt-12 text-sm text-gray-500 border-t pt-6">
            Oxirgi yangilangan sana: 15-Avgust, 2026-yil.
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#1E40AF] text-white pt-10 pb-6 px-4 md:px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto text-center text-sm text-blue-200">
          <p>&copy; 2026 EduStack LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
