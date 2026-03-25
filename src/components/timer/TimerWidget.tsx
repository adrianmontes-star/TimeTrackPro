"use client";

import { useState, useEffect } from "react";
import { Play, Square, Briefcase, ListTodo } from "lucide-react";
import { toast } from "sonner";
import { createTimeSession, stopTimeSession } from "@/server/actions/time-sessions";

type Project = any; // We can type this strictly later if needed
type Session = any;

export default function TimerWidget({ 
  initialProjects, 
  activeSession 
}: { 
  initialProjects: Project[], 
  activeSession: Session | null 
}) {
  const [projectId, setProjectId] = useState(activeSession?.projectId || "");
  const [taskId, setTaskId] = useState(activeSession?.taskId || "");
  const [isTracking, setIsTracking] = useState(!!activeSession);
  const [timeState, setTimeState] = useState(0); // seconds passed
  const [isActionDisabled, setIsActionDisabled] = useState(false);

  // Derivar las tareas dependiento del proyecto seleccionado
  const selectedProjectObj = initialProjects.find(p => p.id === projectId);
  const availableTasks = selectedProjectObj?.tasks || [];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTracking && activeSession) {
      // Calculate diff in seconds
      const calcElapsed = () => {
        const start = new Date(activeSession.startTime).getTime();
        const now = Date.now();
        return Math.floor((now - start) / 1000);
      };
      
      setTimeState(calcElapsed());
      
      interval = setInterval(() => {
        setTimeState(calcElapsed());
      }, 1000);
    } else {
      setTimeState(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, activeSession]);

  const handleStart = async () => {
    if (!projectId || !taskId) {
      toast.error("Selecciona un proyecto y una tarea para comenzar.");
      return;
    }
    setIsActionDisabled(true);
    const res = await createTimeSession({ projectId, taskId });
    setIsActionDisabled(false);
    if (res.success) {
      toast.success("Temporizador iniciado");
      setIsTracking(true);
    } else {
      toast.error("Hubo un error al iniciar sesión en el servidor");
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;
    setIsActionDisabled(true);
    const res = await stopTimeSession(activeSession.id);
    setIsActionDisabled(false);
    if (res.success) {
      toast.success("Tiempo registrado exitosamente");
      setIsTracking(false);
      setProjectId("");
      setTaskId("");
    } else {
      toast.error(res.error || "Error al detener temporizador");
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border text-gray-800 border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center">
      {/* Timer Header */}
      <div className={`w-full p-8 flex flex-col items-center justify-center transition-colors duration-500 relative ${isTracking ? 'bg-[#052e16] text-white' : 'bg-gray-50'}`}>
        {isTracking && (
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 50% -20%, #4ade80 0%, transparent 40%), radial-gradient(circle at 100% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 0% 100%, #16a34a 0%, transparent 50%)'
          }}></div>
        )}
        
        <div className="relative z-10 text-center">
          <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">Trackeo de Tiempo</p>
          <div className="text-6xl font-light tabular-nums tracking-tight">
            {formatTime(timeState)}
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="w-full p-6 space-y-4 bg-white">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            Proyecto
          </label>
          <div className="relative">
            <select
              disabled={isTracking || isActionDisabled}
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setTaskId(""); // Reset task on project change
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent cursor-pointer disabled:opacity-50 transition-all font-medium text-gray-700"
            >
              <option value="" disabled>-- Selecciona un proyecto --</option>
              {initialProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Briefcase className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            Tarea
          </label>
          <div className="relative">
            <select
              disabled={isTracking || !projectId || isActionDisabled}
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent cursor-pointer disabled:opacity-50 transition-all font-medium text-gray-700"
            >
              <option value="" disabled>-- Selecciona la tarea asignada --</option>
              {availableTasks.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ListTodo className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-center">
          {!isTracking ? (
            <button
              onClick={handleStart}
              disabled={isActionDisabled || !projectId || !taskId}
              className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#15803d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(22,101,52,0.39)] hover:shadow-[0_6px_20px_rgba(22,101,52,0.23)]"
            >
              <Play className="w-5 h-5 fill-current" />
              INICIAR CRONÓMETRO
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={isActionDisabled}
              className="w-full py-4 rounded-xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)]"
            >
              <Square className="w-5 h-5 fill-current" />
              DETENER CRONÓMETRO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
