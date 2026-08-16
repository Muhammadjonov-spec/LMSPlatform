import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../../../services/teacherService";
import { Button } from "../../../components/ui";

export default function TeacherApproval() {
  const queryClient = useQueryClient();

  const { data: pendingTeachers, isLoading, isError } = useQuery({
    queryKey: ["pendingTeachers"],
    queryFn: () => teacherService.getPendingTeachers().then(res => res.data)
  });

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: (id) => teacherService.approveTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingTeachers"]);
      alert("O'qituvchi muvaffaqiyatli tasdiqlandi!");
    },
    onError: (err) => {
      alert(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  });

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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">O'qituvchi arizalari</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          O'qituvchi bo'lish uchun yuborilgan arizalarni ko'rib chiqing va tasdiqlang.
        </p>
      </div>

      {!pendingTeachers || pendingTeachers.length === 0 ? (
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
          {pendingTeachers.map((teacher) => (
            <div key={teacher._id} className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xl shrink-0 overflow-hidden">
                  {teacher.user?.avatar ? (
                    <img src={teacher.user.avatar} alt={teacher.user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    teacher.user?.firstName?.charAt(0) || "U"
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {teacher.user?.firstName} {teacher.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.user?.email}</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-3 mb-6">
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tajriba:</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{teacher.experienceYears} yil</p>
                </div>
                
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">O'zi haqida (Bio):</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3" title={teacher.bio}>
                    {teacher.bio}
                  </p>
                </div>

                {(teacher.socialLinks?.youtube || teacher.socialLinks?.linkedin) && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Ijtimoiy tarmoqlar:</span>
                    <div className="flex gap-3 mt-1">
                      {teacher.socialLinks?.youtube && (
                        <a href={teacher.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-red-600 hover:underline text-sm font-medium">YouTube</a>
                      )}
                      {teacher.socialLinks?.linkedin && (
                        <a href={teacher.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">LinkedIn</a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button 
                  variant="primary" 
                  className="w-full bg-green-600 hover:bg-green-700 border-transparent text-white"
                  onClick={() => approve(teacher._id)}
                  disabled={isApproving}
                >
                  {isApproving ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
