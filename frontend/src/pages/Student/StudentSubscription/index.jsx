import React from "react";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import { STUDENT_SESSION } from "../../../utils/const";

export default function StudentSubscriptionPage() {
  const session = useRouteLoaderData(STUDENT_SESSION);

  const data = useLoaderData() || {};
  const currentPlan = data.currentPlan || null;
  const availablePlans = data.availablePlans || [];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mening Obunalarim</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Joriy tarifingizni ko'ring va yangilang
        </p>
      </div>

      {/* Current Plan */}
      {currentPlan ? (
        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{currentPlan.name}</h3>
                <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                  Faol
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keyingi yangilanish: {currentPlan.renewDate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-[#1E40AF] dark:text-[#3b82f6]">
                {currentPlan.price === 0 ? "Tekin" : `${currentPlan.price?.toLocaleString()} so'm`}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">/oyiga</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Joriy imkoniyatlari:</p>
            <ul className="flex flex-wrap gap-3">
              {(currentPlan.features || []).map((f, i) => (
                <li key={i} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6 mb-8 text-center text-gray-500">
          Sizda faol obuna yo'q
        </div>
      )}

      {/* Available Plans */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tarifni yangilash</h2>
      {availablePlans.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
          Hozircha yangi tariflar mavjud emas
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availablePlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border ${
                plan.popular
                  ? "border-[#1E40AF] shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                  : "border-gray-200 dark:border-white/10"
              } bg-white dark:bg-white/5 p-6 flex flex-col relative`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-[#1E40AF] text-white text-xs font-semibold rounded-full shadow-md">
                  Mashhur
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-3xl font-extrabold text-[#1E40AF] dark:text-[#3b82f6]">
                  {plan.price?.toLocaleString()} <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">so'm/{plan.period}</span>
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {(plan.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-xl py-3 font-semibold transition-colors ${
                  plan.popular
                    ? "bg-[#1E40AF] text-white hover:bg-blue-800 shadow-md"
                    : "bg-gray-50 dark:bg-white/10 text-[#1E40AF] dark:text-[#3b82f6] hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10"
                }`}
              >
                Yangilash
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
