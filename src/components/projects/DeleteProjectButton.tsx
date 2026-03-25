"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/server/actions/projects";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the project link
    
    if (confirm(`¿Estás seguro de que deseas eliminar el proyecto "${projectName}"? Esta acción no se puede deshacer y eliminará todas sus tareas y registros de tiempo.`)) {
      setIsDeleting(true);
      const res = await deleteProject(projectId);
      setIsDeleting(false);
      
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Error al eliminar el proyecto");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-all ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-600 hover:bg-red-50'}`}
      title="Eliminar Proyecto"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
