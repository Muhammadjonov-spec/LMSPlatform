import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmailToken } from "../../services/authServices";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Tasdiqlash tokeni topilmadi.");
      return;
    }

    verifyEmailToken(token)
      .then(() => {
        setStatus("success");
        setMessage("Email muvaffaqiyatli tasdiqlandi!");
        // 3 soniyadan keyin sign-in sahifasiga yuboramiz
        setTimeout(() => {
          navigate("/sign-in?verified=true");
        }, 3000);
      })
      .catch((err) => {
        setStatus("error");
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Tasdiqlash kodi yaroqsiz yoki muddati o'tgan.";
        setMessage(msg);
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-800">Email tasdiqlanmoqda...</h2>
            <p className="text-gray-500 mt-2 text-sm">Iltimos, kuting.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-700">Muvaffaqiyatli!</h2>
            <p className="text-gray-600 mt-2 text-sm">{message}</p>
            <p className="text-gray-400 mt-4 text-xs">3 soniyada tizimga kirish sahifasiga o'tasiz...</p>
            <Link
              to="/sign-in?verified=true"
              className="mt-6 inline-block bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
            >
              Tizimga kirish
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-700">Xato yuz berdi</h2>
            <p className="text-gray-600 mt-2 text-sm">{message}</p>
            <Link
              to="/sign-up"
              className="mt-6 inline-block bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
            >
              Qayta ro'yxatdan o'tish
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
