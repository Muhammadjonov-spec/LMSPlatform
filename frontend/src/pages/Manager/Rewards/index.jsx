import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import EmptyState from "../../../components/EmptyState";

export default function RewardsPage() {
  const initialData = useLoaderData();
  const [leaderboard, setLeaderboard] = useState(initialData?.data?.leaderboard || []);
  const [badges, setBadges] = useState(initialData?.data?.badges || []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "🏆" });

  const handleAddBadge = (e) => {
    e.preventDefault();
    setBadges([...badges, { id: Date.now(), ...formData }]);
    setIsModalOpen(false);
    setFormData({ name: "", description: "", icon: "🏆" });
  };

  const handleDeleteBadge = (id) => {
    if (window.confirm("Are you sure you want to delete this badge?")) {
      setBadges(badges.filter(b => b.id !== id));
    }
  };

  if (!initialData) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState title="Rewards and Gamification not available" message="No data found yet or API is not implemented." />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rewards and Gamification</h1>
        <p className="mt-2 text-sm text-gray-700">Manage student rankings and badges</p>
      </div>

      {/* Leaderboard Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Top Students (Leaderboard)</h2>
        </div>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((student) => (
                <tr key={student.id} className={student.rank <= 3 ? 'bg-yellow-50/30' : ''}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900">
                    {student.rank === 1 ? '🥇 1' : student.rank === 2 ? '🥈 2' : student.rank === 3 ? '🥉 3' : `#${student.rank}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{student.studentName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-[#1E40AF]">{student.points} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Badges Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Badges</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-md bg-[#1E40AF] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 transition-colors"
          >
            + Create Badge
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <span className="text-5xl mb-4">{badge.icon}</span>
              <h3 className="font-bold text-gray-900">{badge.name}</h3>
              <p className="mt-1 text-sm text-gray-500 flex-1">{badge.description}</p>
              <button onClick={() => handleDeleteBadge(badge.id)} className="mt-4 text-xs font-semibold text-red-600 hover:text-red-800">Delete</button>
            </div>
          ))}
          {badges.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">No badges found.</div>}
        </div>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Create New Badge</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleAddBadge} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF]" placeholder="Example: Code Master" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                <input required type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF] text-2xl" placeholder="🏆" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1E40AF]" placeholder="Reason for awarding..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1E40AF] rounded-lg hover:bg-blue-800">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
