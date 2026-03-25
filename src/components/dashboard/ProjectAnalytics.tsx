"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export default function ProjectAnalytics({ data }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data.map(d => ({
    name: d.name,
    value: d.hours,
    isActive: d.hours > 0,
    tooltip: `${d.hours} h`
  })) : [
    { name: "D", value: 0, isActive: false, tooltip: "0 h" },
    { name: "L", value: 0, isActive: false, tooltip: "0 h" },
    { name: "M", value: 0, isActive: false, tooltip: "0 h" },
    { name: "M", value: 0, isActive: false, tooltip: "0 h" },
    { name: "J", value: 0, isActive: false, tooltip: "0 h" },
    { name: "V", value: 0, isActive: false, tooltip: "0 h" },
    { name: "S", value: 0, isActive: false, tooltip: "0 h" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Project Analytics</h3>
      </div>
      
      <div className="flex-1 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barSize={32}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[50, 50, 50, 50]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  // Use pattern for inactive bars, solid color for active
                  fill={entry.isActive ? (entry.value > 8 ? '#14532d' : entry.value > 4 ? '#166534' : '#4ade80') : 'url(#stripePattern)'} 
                />
              ))}
            </Bar>
            
            <defs>
              <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y="0" x2="0" y2="8" stroke="#dcfce7" strokeWidth="4" />
              </pattern>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
