import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending an email or saving to DB
    setStatus("success");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setStatus(null), 5000);
  };

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

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Biz bilan bog'lanish</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Takliflaringiz, shikoyatlaringiz yoki savollaringiz bo'lsa, iltimos bizga yozing. Tez orada sizga javob qaytaramiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="p-8 sm:p-12 bg-[#1E40AF] text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Aloqa Ma'lumotlari</h2>
              <p className="text-blue-100 mb-10">Bizning jamoa dushanbadan jumagacha, soat 09:00 dan 18:00 gacha xizmatingizga tayyor.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Telefon</h4>
                    <p className="text-blue-100">+998 90 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <p className="text-blue-100">support@edustack.uz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Manzil</h4>
                    <p className="text-blue-100">Toshkent shahar, Yunusobod tumani, 14-daha, IT Park binosi</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h4 className="font-semibold text-lg mb-4">Ijtimoiy tarmoqlar</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">TG</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">IN</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">FB</a>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Xabar yuborish</h2>
            
            {status === "success" && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism va Familiyangiz</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                  placeholder="Masalan: Sardorbek"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email manzilingiz</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                  placeholder="Sizga shu pochta orqali javob yozamiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xabaringiz matni</label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Nimada yordam bera olamiz?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-blue-800 transition-colors shadow-md transform hover:-translate-y-1"
              >
                Xabarni Yuborish
              </button>
            </form>
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
