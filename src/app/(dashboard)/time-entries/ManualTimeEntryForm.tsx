"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createManualTimeSession } from "@/server/actions/time-sessions";

export default function ManualTimeEntryForm({ projects }: { projects: any[] }) {
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = projects.find(p => p.id === projectId);
  const tasks = selectedProject?.tasks || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !taskId) {
      toast.error("Selecciona proyecto y tarea");
      return;
    }

    setIsLoading(true);
    const res = await createManualTimeSession({
      projectId, taskId, date, startTime, endTime, notes
    });
    setIsLoading(false);

    if (res.success) {
      toast.success("Tiempo registrado exitosamente");
      // Reset some fields
      setProjectId("");
      setTaskId("");
      setNotes("");
    } else {
      toast.error(res.error || "Error al registrar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
        <select 
          required
          value={projectId} 
          onChange={e => { setProjectId(e.target.value); setTaskId(""); }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
        >
          <option value="">-- Seleccionar --</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tarea</label>
        <select 
          required
          disabled={!projectId}
          value={taskId} 
          onChange={e => setTaskId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors disabled:opacity-50"
        >
          <option value="">-- Seleccionar --</option>
          {tasks.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input 
          type="date" 
          required
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
          <input 
            type="time" 
            required
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
          <input 
            type="time" 
            required
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
        <textarea 
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white resize-none h-20"
          placeholder="Qué hiciste en este tiempo..."
        />
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-[var(--primary)] text-white font-medium py-2.5 rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
      >
        {isLoading ? "Guardando..." : "Guardar Registro"}
      </button>
    </form>
  );
}
