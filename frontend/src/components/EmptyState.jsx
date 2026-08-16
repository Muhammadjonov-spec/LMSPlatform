import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

export default function EmptyState({ message = "Hozircha ma'lumot yo'q yoki tizim to'liq ishga tushmagan.", title = "Ma'lumot topilmadi" }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[300px] p-8 bg-white dark:bg-white/5 rounded-[20px] shadow-sm border border-gray-100 dark:border-white/10 text-center transition-colors duration-300">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faBoxOpen} className="w-10 h-10 text-[#1E40AF] dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-[300px]">{message}</p>
    </div>
  );
}
