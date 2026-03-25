"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { getCalendarData } from "@/server/actions/calendar";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      // getCalendarData expects 1-indexed month
      const res = await getCalendarData(currentMonth + 1, currentYear);
      if (res.success) {
        setData(res.data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [currentMonth, currentYear]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar grid
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const currentDay = today.getDate();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-[var(--primary)] rounded-lg">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors border border-gray-200 bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200 bg-white"
          >
            Hoy
          </button>
          
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors border border-gray-200 bg-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 flex-1">
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
          {/* Day Headers */}
          {daysOfWeek.map(day => (
            <div key={day} className="bg-gray-50 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}

          {/* Blank Days */}
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="bg-gray-50/50 min-h-[120px] p-2"></div>
          ))}

          {/* Actual Days */}
          {days.map(day => {
            const isToday = isCurrentMonth && day === currentDay;
            const dayData = data[day] || {};
            const usersWorked = Object.values(dayData) as any[];

            return (
              <div 
                key={day} 
                className={`min-h-[140px] bg-white p-2 transition-colors hover:bg-gray-50 ${isToday ? 'ring-2 ring-inset ring-[var(--primary)] bg-green-50/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  
                  {usersWorked.length > 0 && (
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {usersWorked.length}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="animate-pulse flex flex-col gap-2 mt-4 px-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 mt-1 max-h-[90px] overflow-y-auto no-scrollbar pb-1">
                    {usersWorked.map((userStat: any) => {
                      // Asegurarse de que muestre mínimo 0.1h si hubo segundos trackeados
                      let rawHours = userStat.totalSeconds / 3600;
                      if (userStat.totalSeconds > 0 && rawHours < 0.1) rawHours = 0.1;

                      const hours = rawHours.toFixed(1);
                      const initial = (userStat.user?.name || userStat.user?.email || "U").charAt(0).toUpperCase();
                      
                      return (
                        <div key={userStat.user?.id} className="flex items-center justify-between bg-blue-50/50 hover:bg-blue-100 rounded border border-blue-100/50 px-1.5 py-1 transition-colors group cursor-default" title={userStat.user?.name || userStat.user?.email}>
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <div className="w-5 h-5 flex-shrink-0 bg-blue-200 text-blue-700 rounded-full text-[9px] font-bold flex items-center justify-center">
                              {initial}
                            </div>
                            <span className="text-[10px] font-medium text-gray-700 truncate group-hover:text-blue-900">
                              {userStat.user?.name?.split(' ')[0] || userStat.user?.email?.split('@')[0]}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--primary)] whitespace-nowrap">
                            {hours}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
