import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { teacherService } from "../../services/teacherService";
import { Input, Button, Card, CardBody, CardHeader } from "../../components/ui";

export default function TeacherApply() {
  const [formData, setFormData] = useState({ bio: "", experienceYears: "", phone: "", linkedin: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data: myApplication, isLoading } = useQuery({
    queryKey: ["myTeacherApplication"],
    queryFn: () => teacherService.getMyApplication().then(res => res.data)
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => teacherService.applyForTeacher(data)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const socialLinks = { linkedin: formData.linkedin };
      await mutateAsync({ 
        bio: formData.bio, 
        experienceYears: Number(formData.experienceYears), 
        phone: formData.phone,
        socialLinks 
      });
      setMessage("Arizangiz muvaffaqiyatli yuborildi! Administratorlar ko'rib chiqib sizga aloqaga chiqishadi.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If application is pending
  if (myApplication && myApplication.status === 'pending' && !message) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl shadow-lg border-0 ring-1 ring-black/5 rounded-2xl overflow-hidden text-center p-8">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Arizangiz ko'rib chiqilmoqda</h2>
          <p className="text-gray-600 mb-8">Iltimos, administratorlar arizangizni tasdiqlashini kuting. Siz bilan tez orada aloqaga chiqishadi.</p>
          <Link to="/student">
            <Button variant="primary">Bosh sahifaga qaytish</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg border-0 ring-1 ring-black/5 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center border-none">
          <h1 className="text-white font-bold text-2xl tracking-tight mb-2">O'qituvchi bo'lish</h1>
          <p className="text-blue-100 text-sm">O'z bilimingizni minglab o'quvchilar bilan bo'lishing.</p>
        </CardHeader>
        <CardBody className="p-8">
          {message ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-600 mb-4">{message}</h2>
              <Link to="/student">
                <Button variant="primary">Bosh sahifaga qaytish</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {myApplication?.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
                  <h3 className="font-bold text-red-700 mb-1">Arizangiz bekor qilingan</h3>
                  <p className="text-sm text-red-600">Sabab: {myApplication.rejectionReason || "Ko'rsatilmagan"}</p>
                  <p className="text-sm text-gray-600 mt-2">Ma'lumotlarni to'g'rilab qaytadan yuborishingiz mumkin.</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Input 
                label="O'zingiz haqingizda (Bio)" 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                required
              />
              <Input 
                label="Tajriba (yil)" 
                type="number"
                value={formData.experienceYears}
                onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                required
              />
              <Input 
                label="Telefon raqami (Majburiy)" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                placeholder="+998 90 123 45 67"
              />
              <Input 
                label="LinkedIn profil (Ixtiyoriy)" 
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
              <Button type="submit" variant="primary" className="w-full mt-4" disabled={isPending}>
                {isPending ? "Yuborilmoqda..." : (myApplication?.status === 'rejected' ? "Qaytadan yuborish" : "Arizani yuborish")}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
