import React from 'react';
import { Calendar, Users, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: Calendar, value: '280', label: 'Días de formación', color: 'text-[#c4ff0f]' },
    { icon: Users, value: '3', label: 'Niveles evolutivos', color: 'text-[#7c3aed]' },
    { icon: Globe, value: '100%', label: 'Online y flexible', color: 'text-[#c4ff0f]' },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;