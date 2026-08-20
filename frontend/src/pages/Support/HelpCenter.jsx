import React from "react";
import Navbar from "../../components/Navbar";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Yordam Markazi</h1>
        <p className="text-gray-600">Bu sahifa hozircha qurilmoqda. Tez orada tayyor bo'ladi.</p>
      </div>
    </div>
  );
}
