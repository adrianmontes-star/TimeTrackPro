"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ProjectProgress({ rate = 0 }: { rate?: number }) {
  const data = [
    { name: "Completed", value: rate, color: "#166534" },
    { name: "In Progress", value: 100 - rate, color: rate === 0 ? "#e5e7eb" : "url(#stripePatternDark)" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-semibold text-gray-900 mb-2">Porcentaje Completado</h3>
      
      <div className="flex-1 w-full relative min-h-[160px] flex items-center justify-center">
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
          <span className="text-[2.5rem] font-bold tracking-tight text-gray-900 leading-none">{rate}%</span>
          <span className="text-xs text-green-700 font-medium mt-1">Terminados</span>
        </div>
        
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <defs>
              <pattern id="stripePatternDark" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y="0" x2="0" y2="6" stroke="#86efac" strokeWidth="3" />
              </pattern>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-50 px-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-[#166534]"></div>
          Completed
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M-1.5,4.5 L4.5,-1.5 M-1.5,10.5 L10.5,-1.5 M4.5,10.5 L10.5,4.5\' stroke=\'%2386efac\' stroke-width=\'3\'/%3E%3C/svg%3E")' }}></div>
          In Progress
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M-1.5,4.5 L4.5,-1.5 M-1.5,10.5 L10.5,-1.5 M4.5,10.5 L10.5,4.5\' stroke=\'%23e5e7eb\' stroke-width=\'1.5\'/%3E%3C/svg%3E")' }}></div>
          Pending
        </div>
      </div>
    </div>
  );
}
