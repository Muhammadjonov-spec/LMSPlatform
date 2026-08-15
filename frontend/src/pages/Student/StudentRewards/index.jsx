import React from "react";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import { STUDENT_SESSION } from "../../../utils/const";

export default function StudentRewardsPage() {
  const session = useRouteLoaderData(STUDENT_SESSION);

  const data = useLoaderData() || {};
  const myBadges = data.badges || [];
  const myStats = data.stats || {
    totalPoints: 0,
    rank: 0,
    coursesCompleted: 0,
    assignmentsCompleted: 0,
    streak: 0
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mening Yutuqlarim</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          O'qish jarayonidagi yutuqlaringiz va nishonlaringiz
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#1E40AF] dark:text-[#3b82f6]">{myStats.totalPoints}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Jami XP</p>
        </div>
        <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#1E40AF] dark:text-[#3b82f6]">#{myStats.rank}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Reyting o'rni</p>
        </div>
        <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#1E40AF] dark:text-[#3b82f6]">{myStats.coursesCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Kurs yakunlangan</p>
        </div>
        <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#1E40AF] dark:text-[#3b82f6]">{myStats.assignmentsCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Topshiriqlar</p>
        </div>
        <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm col-span-2 sm:col-span-1">
          <p className="text-2xl font-extrabold text-orange-500">🔥 {myStats.streak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Kunlik streak</p>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Nishonlarim (Badges)</h2>
        {myBadges.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
            Hozircha nishonlar yo'q
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBadges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-xl border p-5 flex items-start gap-4 transition-all ${
                  badge.earned
                    ? "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm"
                    : "bg-gray-50 dark:bg-white/[0.02] border-gray-100 dark:border-white/5 opacity-60"
                }`}
              >
                <div className={`text-4xl flex-shrink-0 ${!badge.earned ? "grayscale" : ""}`}>
                  {badge.icon || "🏆"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{badge.name}</h3>
                    {badge.earned && (
                      <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-[10px] font-semibold rounded">
                        Olingan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                  {badge.earned && badge.date && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">{badge.date}</p>
                  )}
                  {!badge.earned && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 italic">Hali olinmagan</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
