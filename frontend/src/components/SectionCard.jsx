// src/components/SectionCard.jsx
import React from 'react';

const SectionCard = ({ title, icon, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-md text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-blue-50"
      onClick={onClick}
    >
      <i className={`fas ${icon} text-4xl text-blue-600 mb-3`}></i>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
};

export default SectionCard;
