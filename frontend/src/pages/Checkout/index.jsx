import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);

  const handlePayment = (e) => {
    e.preventDefault();
    if (!receipt) {
      alert("Iltimos, to'lov chekini yuklang!");
      return;
    }
    // Simulate payment processing...
    setTimeout(() => {
      navigate("/success-checkout");
    }, 1500);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-rounded text-[#1E40AF] text-3xl">receipt_long</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">To'lovni tasdiqlash</h1>
          <p className="text-gray-500">Kurs ID: {id} uchun to'lov qiling va chekni yuklang</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Quyidagi karta raqamiga to'lovni amalga oshiring:</p>
          <div className="text-xl font-extrabold text-[#1E40AF] tracking-widest mb-1">8600 1234 5678 9012</div>
          <p className="text-xs font-semibold text-gray-500">Qabul qiluvchi: EduStack O'quv Markazi</p>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-600">To'lov summasi:</p>
            <p className="text-2xl font-extrabold text-gray-900">490 000 UZS</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To'lov cheki (Rasm yoki PDF)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                <span className="material-symbols-rounded text-gray-400 text-4xl mb-2">cloud_upload</span>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#1E40AF] hover:text-blue-500 focus-within:outline-none">
                    <span>Fayl tanlash</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                  </label>
                  <p className="pl-1">yoki shu yerga tashlang</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF (Max. 5MB)</p>
              </div>
            </div>
            {receipt && (
              <div className="mt-3 text-sm text-green-600 font-medium flex items-center gap-2">
                <span className="material-symbols-rounded text-base">check_circle</span>
                Yuklandi: {receipt.name}
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg mt-8">
            Tasdiqlash uchun yuborish
          </button>
        </form>
      </div>
    </div>
  );
}
