import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export default function Reminders({ tasks = [] }: { tasks?: any[] }) {
  const nextTask = tasks.find(t => t.status === "PENDING") || tasks[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-semibold text-gray-900 mb-6">Próxima Tarea</h3>
      
      <div className="flex-1">
        {nextTask ? (
          <>
            <h4 className="text-xl font-bold text-[#166534] leading-tight mb-2 line-clamp-2">
              {nextTask.name}
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              Proyecto: <span className="font-medium text-gray-700">{nextTask.project?.name || "Sin Proyecto"}</span>
            </p>
          </>
        ) : (
          <>
            <h4 className="text-xl font-bold text-gray-400 leading-tight mb-2">
              Todo al día 🎉
            </h4>
            <p className="text-sm text-gray-500 mb-6">No tienes tareas pendientes vigentes.</p>
          </>
        )}
      </div>

      <Link 
        href={nextTask?.projectId ? `/projects/${nextTask.projectId}` : "/projects"}
        className="w-full bg-[#166534] hover:bg-[#15803d] text-white font-semibold flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-colors text-center"
      >
        {nextTask ? "Ver Proyecto" : "Ir a Proyectos"}
      </Link>
    </div>
  );
}
