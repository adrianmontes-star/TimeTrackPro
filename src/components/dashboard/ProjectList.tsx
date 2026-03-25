import { MoreHorizontal, Plus, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function ProjectList({ projects = [] }: { projects?: any[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Lista de Proyectos</h3>
        <button className="text-gray-400 hover:text-gray-900">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Aún no hay proyectos activos</p>
          </div>
        ) : (
          projects.map((project, i) => {
            const totalSeconds = project.totalSeconds || 0;
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.round((totalSeconds % 3600) / 60);
            const ds = new Date(project.createdAt).toLocaleDateString();
            return (
              <Link href={`/projects/${project.id}`} key={project.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 block">
                <div 
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: project.color || "#166534" }}
                >
                  <span className="font-bold text-sm tracking-tighter">P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{project.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Creado: {ds}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900">{h}h {m}m</span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <Link href="/projects" className="w-full flex justify-center items-center gap-2 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:text-[#166534] hover:border-[#166534] hover:bg-green-50 transition-colors bg-transparent text-sm font-medium">
        <Plus className="w-4 h-4" />
        Ver Todos
      </Link>
    </div>
  );
}
