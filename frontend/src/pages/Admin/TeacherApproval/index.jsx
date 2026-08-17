import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../../../services/teacherService";
import { Button } from "../../../components/ui";

export default function TeacherApproval() {
  const queryClient = useQueryClient();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ["allTeacherApplications"],
    queryFn: () => teacherService.getAllApplications().then(res => res.data)
  });

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: (id) => teacherService.approveTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["allTeacherApplications"]);
      setIsViewModalOpen(false);
      alert("O'qituvchi muvaffaqiyatli tasdiqlandi!");
    },
    onError: (err) => {
      alert(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: ({ id, reason }) => teacherService.rejectTeacher(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["allTeacherApplications"]);
      setIsRejectModalOpen(false);
      setIsViewModalOpen(false);
      setRejectReason("");
      alert("O'qituvchi arizasi bekor qilindi!");
    },
    onError: (err) => {
      alert(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  });

  const handleOpenRejectModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return alert("Bekor qilish sababini yozing");
    reject({ id: selectedTeacher._id, reason: rejectReason });
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-bold">Ma'lumotlarni yuklashda xatolik yuz berdi.</h2>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">O'qituvchi arizalari</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          O'qituvchi bo'lish uchun yuborilgan arizalarni ko'rib chiqing va tasdiqlang.
        </p>
      </div>

      {!applications || applications.length === 0 ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-white/10">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yangi arizalar yo'q</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Hozircha o'qituvchi bo'lish uchun hech qanday ariza kelib tushmagan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((teacher) => (
            <div key={teacher._id} className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col h-full relative">
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {teacher.status === 'pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Kutmoqda</span>}
                {teacher.status === 'approved' && <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Tasdiqlangan</span>}
                {teacher.status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Bekor qilingan</span>}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xl shrink-0 overflow-hidden">
                  {teacher.user?.avatar ? (
                    <img src={teacher.user.avatar} alt={teacher.user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    teacher.user?.firstName?.charAt(0) || "U"
                  )}
                </div>
                <div className="pr-16">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                    {teacher.user?.firstName} {teacher.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{teacher.user?.email}</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-3 mb-6 mt-2">
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tajriba:</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{teacher.experienceYears} yil</p>
                </div>
                
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Telefon raqam:</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{teacher.phone || "Ko'rsatilmagan"}</p>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleViewDetails(teacher)}
                >
                  To'liq ko'rish
                </Button>
                {teacher.status === 'pending' && (
                  <div className="flex gap-2 mt-1">
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent"
                      onClick={() => handleOpenRejectModal(teacher)}
                      disabled={isRejecting || isApproving}
                    >
                      Bekor qilish
                    </Button>
                    <Button 
                      variant="primary" 
                      className="w-full bg-green-600 hover:bg-green-700 border-transparent text-white"
                      onClick={() => approve(teacher._id)}
                      disabled={isApproving || isRejecting}
                    >
                      {isApproving ? "..." : "Tasdiqlash"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Arizani bekor qilish</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Siz <strong>{selectedTeacher.user?.firstName} {selectedTeacher.user?.lastName}</strong> ning arizasini bekor qilmoqchisiz. Iltimos, sababini ko'rsating.
            </p>
            <form onSubmit={handleRejectSubmit}>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 mb-4 outline-none focus:border-blue-500 min-h-[100px]"
                placeholder="Bekor qilish sababini yozing..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsRejectModalOpen(false)}>Yopish</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={isRejecting}>
                  {isRejecting ? "Bekor qilinmoqda..." : "Bekor qilish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">O'qituvchi arizasi</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden shrink-0">
                  {selectedTeacher.user?.avatar ? (
                    <img src={selectedTeacher.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    selectedTeacher.user?.firstName?.charAt(0) || "U"
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">{selectedTeacher.user?.firstName} {selectedTeacher.user?.lastName}</h4>
                  <p className="text-gray-500">{selectedTeacher.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tajriba</p>
                  <p className="text-gray-900 font-medium">{selectedTeacher.experienceYears} yil</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Telefon raqam</p>
                  <p className="text-gray-900 font-medium">{selectedTeacher.phone || "Kiritilmagan"}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">O'zi haqida (Bio)</p>
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedTeacher.bio}</p>
              </div>

              {selectedTeacher.socialLinks?.linkedin && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">LinkedIn Profil</p>
                  <a href={selectedTeacher.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {selectedTeacher.socialLinks.linkedin}
                  </a>
                </div>
              )}
            </div>

            {selectedTeacher.status === 'pending' ? (
              <div className="flex gap-3 justify-end mt-8 border-t border-gray-100 pt-6">
                <Button type="button" variant="outline" onClick={() => setIsViewModalOpen(false)}>Yopish</Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => { setIsViewModalOpen(false); handleOpenRejectModal(selectedTeacher); }}
                >
                  Bekor qilish
                </Button>
                <Button 
                  variant="primary" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => approve(selectedTeacher._id)}
                  disabled={isApproving}
                >
                  {isApproving ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 justify-end mt-8 border-t border-gray-100 pt-6">
                <Button type="button" variant="outline" onClick={() => setIsViewModalOpen(false)}>Yopish</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
