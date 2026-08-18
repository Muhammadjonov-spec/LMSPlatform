import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { updateSubscription } from "../../../services/subscriptionService";
import EmptyState from "../../../components/EmptyState";

export default function SubscriptionPage() {
  const initialData = useLoaderData();
  const [plans, setPlans] = useState(initialData?.data || []);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: 0, features: "" });

  const handleToggle = async (id, currentStatus) => {
    const result = await updateSubscription(id, { isActive: !currentStatus });
    if (result) {
      setPlans(plans.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ name: plan.name, price: plan.price, features: plan.features.join("\n") });
    } else {
      setEditingPlan(null);
      setFormData({ name: "", price: 0, features: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedFeatures = formData.features.split("\n").filter(f => f.trim() !== "");
    
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...formData, features: parsedFeatures } : p));
    } else {
      setPlans([...plans, { id: Date.now(), ...formData, features: parsedFeatures, isActive: true }]);
    }
    setIsModalOpen(false);
  };

  if (!initialData) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState title="No plans available" message="No plans found yet or API is not implemented." />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Plans and Subscriptions</h1>
          <p className="mt-2 text-sm text-gray-700">Manage subscription prices and features on your platform</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-[#1E40AF] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800">
            + New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`rounded-2xl border ${plan.isActive ? 'border-blue-500 shadow-md' : 'border-gray-200 opacity-70'} bg-white p-6 flex flex-col transition-all relative overflow-hidden group`}>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-extrabold text-[#1E40AF]">
                {Number(plan.price) === 0 ? "Free" : `${Number(plan.price).toLocaleString()} UZS`}
              </p>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            
            <ul className="flex-1 space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <button
                onClick={() => handleToggle(plan.id, plan.isActive)}
                className={`w-full rounded-xl py-3 font-semibold transition-colors ${
                  plan.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {plan.isActive ? "Deactivate Plan" : "Activate Plan"}
              </button>
              <button
                onClick={() => openModal(plan)}
                className="w-full rounded-xl py-3 font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{editingPlan ? "Edit Plan" : "New Plan"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF]" placeholder="Example: VIP Plan" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (in UZS)</label>
                <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF]" placeholder="0" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (Each line is a separate feature)</label>
                <textarea required rows="4" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF]" placeholder="Access to all courses&#10;Certificate awarded..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1E40AF] rounded-lg hover:bg-blue-800">
                  {editingPlan ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
