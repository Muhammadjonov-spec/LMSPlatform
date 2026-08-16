import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { teacherService } from "../../services/teacherService";
import { Input, Button, Card, CardBody, CardHeader } from "../../components/ui";

export default function TeacherApply() {
  const [formData, setFormData] = useState({ bio: "", experienceYears: "", youtube: "", linkedin: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => teacherService.applyForTeacher(data)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const socialLinks = { youtube: formData.youtube, linkedin: formData.linkedin };
      await mutateAsync({ bio: formData.bio, experienceYears: Number(formData.experienceYears), socialLinks });
      setMessage("Arizangiz muvaffaqiyatli yuborildi! Administratorlar ko'rib chiqib sizga aloqaga chiqishadi.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

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
                label="YouTube kanal (Ixtiyoriy)" 
                value={formData.youtube}
                onChange={(e) => setFormData({...formData, youtube: e.target.value})}
              />
              <Input 
                label="LinkedIn profil (Ixtiyoriy)" 
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
              <Button type="submit" variant="primary" className="w-full mt-4" disabled={isPending}>
                {isPending ? "Yuborilmoqda..." : "Arizani yuborish"}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
