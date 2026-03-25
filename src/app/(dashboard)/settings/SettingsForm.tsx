"use client";

import { useState } from "react";
import { updateWorkdayConfig } from "@/server/actions/settings";
import { toast } from "sonner";
import { Save, Settings2, Clock } from "lucide-react";

export default function SettingsForm({ initialConfig }: { initialConfig: any }) {
  const [formData, setFormData] = useState({
    hoursPerDay: initialConfig?.hoursPerDay || 8,
    hoursPerWeek: initialConfig?.hoursPerWeek || 40,
    overtimeThreshold: initialConfig?.overtimeThreshold || 8,
    dayStartTime: initialConfig?.dayStartTime || "09:00",
    dayEndTime: initialConfig?.dayEndTime || "17:00",
    workDays: initialConfig?.workDays || "1,2,3,4,5"
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await updateWorkdayConfig({
      hoursPerDay: Number(formData.hoursPerDay),
      hoursPerWeek: Number(formData.hoursPerWeek),
      overtimeThreshold: Number(formData.overtimeThreshold),
      dayStartTime: formData.dayStartTime,
      dayEndTime: formData.dayEndTime,
      workDays: formData.workDays
    });
    setIsLoading(false);
    
    if (res.success) {
      toast.success("Configuración actualizada correctamente");
    } else {
      toast.error(res.error || "Error al actualizar la configuración");
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    const days = formData.workDays.split(",").map(Number);
    if (days.includes(dayIndex)) {
      setFormData({ ...formData, workDays: days.filter((d: number) => d !== dayIndex).sort().join(",") });
    } else {
      setFormData({ ...formData, workDays: [...days, dayIndex].sort().join(",") });
    }
  };

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Horario Laboral Estándar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Inicio (Defecto)</label>
            <input 
              type="time" 
              required
              value={formData.dayStartTime}
              onChange={e => setFormData({...formData, dayStartTime: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Fin (Defecto)</label>
            <input 
              type="time" 
              required
              value={formData.dayEndTime}
              onChange={e => setFormData({...formData, dayEndTime: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Horas por Día</label>
            <input 
              type="number" 
              step="0.5"
              required
              value={formData.hoursPerDay}
              onChange={e => setFormData({...formData, hoursPerDay: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Horas por Semana</label>
            <input 
              type="number" 
              step="0.5"
              required
              value={formData.hoursPerWeek}
              onChange={e => setFormData({...formData, hoursPerWeek: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Días Laborables</label>
          <div className="flex flex-wrap gap-2">
            {dayNames.map((day, i) => {
              const isActive = formData.workDays.split(",").includes(i.toString());
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-gray-400" />
          Políticas de Horas Extras
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Umbral de Horas Extras (Diario)</label>
            <span className="text-xs text-gray-500 block mb-2">A partir de cuántas horas se considera overtime.</span>
            <input 
              type="number" 
              step="0.5"
              required
              value={formData.overtimeThreshold}
              onChange={e => setFormData({...formData, overtimeThreshold: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          <Save className="w-5 h-5" />
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
