import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { createCategory, deleteCategory } from "../../../services/categoryService";

export default function CategoriesPage() {
  const initialData = useLoaderData();
  const [categories, setCategories] = useState(initialData?.data || []);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleDelete = async (id) => {
    if (window.confirm("Rostdan ham bu kategoriyani o'chirmoqchimisiz?")) {
      const result = await deleteCategory(id);
      if (result) {
        setCategories(categories.filter((cat) => cat.id !== id));
      }
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name, description: cat.description });
    } else {
      setEditingCat(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCat) {
      // Odatda update api chaqiriladi, mock uchun state'ni yangilaymiz
      setCategories(categories.map(c => c.id === editingCat.id ? { ...c, ...formData } : c));
    } else {
      const result = await createCategory(formData);
      if (result) {
        // Mock success, generatsiya id
        setCategories([...categories, { id: Date.now(), ...formData, courseCount: 0 }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kategoriyalar</h1>
          <p className="mt-2 text-sm text-gray-700">Platformadagi barcha kurs kategoriyalarini boshqarish</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-[#1E40AF] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 transition-colors">
            + Yangi Kategoriya
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Kategoriya nomi</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">Tavsif</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kurslar soni</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Harakatlar</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{category.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">{category.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {category.courseCount} ta kurs
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => openModal(category)} className="text-[#1E40AF] hover:text-blue-900 mr-4">Tahrirlash</button>
                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">O'chirish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && <div className="text-center py-10 text-gray-500">Hech narsa topilmadi.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{editingCat ? "Kategoriyani tahrirlash" : "Yangi Kategoriya"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya Nomi</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]" placeholder="Masalan: Frontend Dasturlash" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsifi</label>
                <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]" placeholder="Kurslar haqida qisqacha ma'lumot..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1E40AF] rounded-lg hover:bg-blue-800">
                  {editingCat ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
