import React from "react";
import Navbar from "../../components/Navbar";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 border-b pb-6">Maxfiylik Siyosati (Privacy Policy)</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <p>
              Sizning maxfiyligingiz EduStack uchun muhim ahamiyatga ega. Ushbu Maxfiylik Siyosati bizning ma'lumotlaringizni qanday yig'ishimiz, ishlatishimiz va himoya qilishimizni tushuntiradi.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Ma'lumotlarni yig'ish</h2>
              <p>Biz quyidagi hollarda siz haqingizdagi ma'lumotlarni yig'amiz:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Saytda ro'yxatdan o'tganingizda (ism, familiya, email va hk.)</li>
                <li>Profilni to'ldirganingizda (rasm, telefon raqami)</li>
                <li>To'lovlarni amalga oshirganingizda (biz bank karta raqamlarini to'liq saqlamaymiz, faqat tranzaksiya tarixini saqlaymiz)</li>
                <li>Kurslarni ko'rganingiz va topshiriqlarni bajarganingizda (progress ma'lumotlari)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Ma'lumotlardan foydalanish</h2>
              <p>Yig'ilgan ma'lumotlar quyidagi maqsadlarda foydalaniladi:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Sizga ta'lim platformasi xizmatlarini taqdim etish</li>
                <li>Profil va kurs natijalaringizni shakllantirish</li>
                <li>Sizga muhim xabarlar, chegirmalar yoki tizim yangiliklari haqida elektron pochta yuborish</li>
                <li>Foydalanuvchi tajribasini (User Experience) yaxshilash va tizimdagi nosozliklarni aniqlash</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Ma'lumotlarni uchinchi shaxslarga uzatish</h2>
              <p>
                EduStack shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaydi. Ma'lumotlaringiz faqatgina platformaning barqaror ishlashi uchun zarur bo'lgan xizmatlarga (masalan, to'lov tizimlari, server provayderlari) texnik maqsadlarda shifrlangan holda yuborilishi mumkin.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Xavfsizlik</h2>
              <p>
                Biz shaxsiy ma'lumotlaringiz xavfsizligini ta'minlash uchun zamonaviy himoya choralaridan (SSL shifrlash, token bazasidagi autentifikatsiya) foydalanamiz. Shunga qaramay, internet orqali ma'lumot uzatishning 100% xavfsiz ekanligiga hech kim kafolat bera olmaydi.
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
