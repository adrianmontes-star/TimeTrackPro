"use client";

import { updateTaskStatus } from "@/server/actions/tasks";
import { toast } from "sonner";
import { useState } from "react";

export default function TaskStatusSelect({ 
  taskId, 
  projectId, 
  initialStatus 
}: { 
  taskId: string; 
  projectId: string; 
  initialStatus: string; 
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsLoading(true);
    
    const res = await updateTaskStatus(taskId, newStatus, projectId);
    setIsLoading(false);
    
    if (res.success) {
      toast.success("Estado de la tarea actualizado");
    } else {
      toast.error(res.error || "Error al actualizar");
      setStatus(initialStatus); // Revert UI if failed
    }
  };

  return (
    <select 
      value={status} 
      onChange={handleChange}
      disabled={isLoading}
      className={`text-xs font-semibold rounded-md px-2 py-1 border outline-none transition-colors cursor-pointer appearance-none ${
        status === "COMPLETED" ? "bg-green-100 text-green-700 border-green-200 focus:ring-green-500" :
        status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-500" :
        "bg-gray-100 text-gray-700 border-gray-200 focus:ring-gray-500"
      }`}
    >
      <option value="PENDING">Pendiente</option>
      <option value="IN_PROGRESS">Avanzando</option>
      <option value="COMPLETED">Completada</option>
    </select>
  );
}
