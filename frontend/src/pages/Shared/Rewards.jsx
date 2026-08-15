import React from "react";
import { Award, Star, Trophy, Target } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function RewardsPage() {
  const { user } = useAuthStore();
  
  const stats = [
    { label: "Total Points", value: "2,450", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Current Rank", value: "Gold", icon: Trophy, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Badges Earned", value: "12", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Missions Completed", value: "48", icon: Target, color: "text-green-500", bg: "bg-green-50" },
  ];

  const badges = [
    { id: 1, name: "Fast Learner", icon: "🚀", description: "Completed 5 courses in a week", date: "2 days ago" },
    { id: 2, name: "Code Master", icon: "💻", description: "Scored 100% on React quiz", date: "1 week ago" },
    { id: 3, name: "Helpful Peer", icon: "🤝", description: "Answered 10 questions in forum", date: "2 weeks ago" },
    { id: 4, name: "Early Bird", icon: "🌅", description: "Studied before 6 AM for 5 days", date: "1 month ago" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Rewards</h1>
        <p className="text-gray-500 mt-2">Track your progress, earn points, and unlock achievements.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Badges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div key={badge.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">{badge.icon}</div>
            <h3 className="font-bold text-gray-900">{badge.name}</h3>
            <p className="text-sm text-gray-500 mt-2 flex-1">{badge.description}</p>
            <p className="text-xs text-gray-400 mt-4 font-medium">{badge.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
