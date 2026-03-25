"use client";

import { useState } from "react";
import { createTask } from "@/server/actions/tasks";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function NewTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    const res = await createTask(projectId, { title, description });
    setIsLoading(false);

    if (res.success) {
      toast.success("Tarea añadida al proyecto");
      setTitle("");
      setDescription("");
    } else {
      toast.error(res.error || "No se pudo añadir la tarea");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <h3 className="font-semibold text-gray-900">Agregar Nueva Tarea</h3>
      
      <div>
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nombre de la tarea"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none h-20"
          disabled={isLoading}
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading || !title.trim()}
        className="self-end bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {isLoading ? "Creando..." : "Crear Tarea"}
      </button>
    </form>
  );
}
