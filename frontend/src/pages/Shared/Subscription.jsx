import React from "react";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const isPremium = user?.plan === "premium";

  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started and exploring.",
      icon: Zap,
      features: ["Access to free courses", "Basic community support", "Standard profile"],
      active: !isPremium
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Unlock premium content and advanced features.",
      icon: Shield,
      features: ["All Premium courses", "Priority support", "Downloadable resources", "Certificate of completion"],
      active: isPremium
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For teams and organizations.",
      icon: Crown,
      features: ["Everything in Pro", "Custom learning paths", "Admin analytics dashboard", "Dedicated success manager"],
      active: false
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 animate-fade-in-up">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Subscription Plans</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">Manage your billing, upgrade your plan, and unlock the full potential of EduStack.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          return (
            <div 
              key={idx} 
              className={`relative rounded-3xl p-8 border ${
                plan.active 
                  ? "border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-500/10 scale-105 z-10" 
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all"
              }`}
            >
              {plan.name === "Pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${plan.active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-gray-100 text-gray-600"}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900">
                {plan.price}
                <span className="ml-1 text-base font-medium text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 line-clamp-2">{plan.description}</p>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600">{feature}</p>
                  </li>
                ))}
              </ul>

              <button className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                plan.active 
                  ? "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50" 
                  : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
              }`}>
                {plan.active ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
