import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function HelpCenter() {
  const faqs = [
    {
      question: "EduStack platformasidan qanday foydalanaman?",
      answer: "Platformadan foydalanish uchun avval ro'yxatdan o'tishingiz (Sign Up) kerak. Keyin qiziqtirgan kursingizni tanlab, 'Sotib olish' tugmasi orqali to'lovni amalga oshirasiz."
    },
    {
      question: "Kurslarga to'lov qanday amalga oshiriladi?",
      answer: "To'lovlar plastik karta orqali (Payme, Click) yoki to'g'ridan-to'g'ri hisob raqamimizga o'tkazish orqali amalga oshirilishi mumkin."
    },
    {
      question: "Kursni tugatgach sertifikat beriladimi?",
      answer: "Ha, har bir kursni muvaffaqiyatli yakunlaganingizdan so'ng, tizim avtomatik ravishda ism-sharifingiz tushirilgan elektron sertifikat taqdim etadi."
    },
    {
      question: "Darslarda savol tug'ilsa, kimga murojaat qilaman?",
      answer: "Har bir kursning 'Muhokamalar' (Q&A) bo'limi mavjud. U yerda o'z savollaringizni qoldirishingiz mumkin, mentorlarimiz yoki boshqa o'quvchilar yordam berishadi."
    }
  ];

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Yordam Markazi (Help Center)</h1>
          <p className="text-lg text-gray-600">
            Sizda savol bormi? Biz sizga yordam berishga tayyormiz.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ko'p beriladigan savollar (FAQ)</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-blue-50 rounded-xl text-center">
            <h3 className="text-lg font-bold text-[#1E40AF] mb-2">Javob topa olmadingizmi?</h3>
            <p className="text-blue-800 mb-4">Bizning jamoamiz bilan bog'laning, biz sizga yordam berishdan xursand bo'lamiz.</p>
            <Link to="/support/contact" className="inline-block bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Biz bilan bog'lanish
            </Link>
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
