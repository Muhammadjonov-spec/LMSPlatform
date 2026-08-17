import React, { useState } from "react";
import ContentItem from "./content-item";
import { Link, useRevalidator } from "react-router-dom";
import PropTypes from "prop-types";
import { addModule } from "../../../services/courseService";
import { useMutation } from "@tanstack/react-query";

export default function TableContent({ modules, courseId }) {
  const [newModuleName, setNewModuleName] = useState("");
  const [isAddingModule, setIsAddingModule] = useState(false);
  const revalidator = useRevalidator();

  const { mutateAsync: createModule, isPending } = useMutation({
    mutationFn: (data) => addModule(data, courseId),
    onSuccess: () => {
      setNewModuleName("");
      setIsAddingModule(false);
      revalidator.revalidate();
    },
    onError: (err) => {
      alert(err?.response?.data?.message || err?.message || "Modul qo'shishda xatolik yuz berdi");
    }
  });

  const handleAddModule = async () => {
    if (!newModuleName.trim()) return;
    await createModule({ moduleTitle: newModuleName });
  };

  return (
    <section id="CourseList" className="flex flex-col w-full gap-[30px]">
      <div className="header flex items-center justify-between bg-[#F8FAFB] rounded-[30px] p-[30px]">
        <h2 className="font-bold text-[22px] leading-[33px]">Modullar va darslar</h2>
        
        {!isAddingModule ? (
          <button
            onClick={() => setIsAddingModule(true)}
            className="w-fit rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-nowrap hover:bg-[#1e3a8a] transition-colors">
            Modul qo'shish
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              placeholder="Modul nomi..."
              className="border border-[#CFDBEF] rounded-full px-4 py-3 outline-none"
              autoFocus
            />
            <button 
              onClick={handleAddModule}
              disabled={isPending}
              className="rounded-full bg-[#1E40AF] text-white px-5 py-3 font-semibold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50">
              {isPending ? "Qo'shilmoqda..." : "Saqlash"}
            </button>
            <button 
              onClick={() => setIsAddingModule(false)}
              className="rounded-full border border-[#060A23] px-5 py-3 font-semibold hover:bg-gray-50 transition-colors">
              Bekor qilish
            </button>
          </div>
        )}
      </div>

      {modules?.length === 0 ? (
        <div className="text-center p-10 bg-[#F8FAFB] rounded-[30px]">
          <p className="text-gray-500 font-semibold">Hozircha hech qanday modul qo'shilmagan.</p>
        </div>
      ) : (
        modules?.map((module, mIndex) => (
          <div key={module._id} className="flex flex-col w-full rounded-[30px] p-[30px] gap-5 bg-[#F8FAFB]">
            <div className="flex items-center justify-between border-b border-[#CFDBEF] pb-4">
              <h3 className="font-bold text-xl">{mIndex + 1}-Modul: {module.title}</h3>
              <Link
                to={`/manager/courses/${courseId}/modules/${module._id}/lessons/create`}
                className="w-fit rounded-full px-5 py-2 font-semibold text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white transition-colors text-sm">
                Dars qo'shish
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {module.lessons?.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Bu modulda darslar mavjud emas.</p>
              ) : (
                module.lessons?.map((lesson, lIndex) => (
                  <ContentItem
                    key={lesson._id}
                    type={lesson.type || "video"}
                    title={lesson.title}
                    id={lesson._id}
                    index={lIndex + 1}
                    courseId={courseId}
                    status={lesson.status}
                  />
                ))
              )}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

TableContent.propTypes = {
  modules: PropTypes.array,
  courseId: PropTypes.string
};
