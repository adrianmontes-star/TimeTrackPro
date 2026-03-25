import { getMyProjects } from "@/server/actions/projects";
import Link from "next/link";
import { Plus, Briefcase, Calendar, Users, ArrowRight } from "lucide-react";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams;
  const { projects } = await getMyProjects(search);
  const displayProjects = projects || [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {search ? `Resultados para "${search}"` : "Proyectos"}
          </h1>
          <p className="text-gray-500">
            {search ? `Mostrando proyectos y tareas que coinciden` : "Gestiona tus proyectos y las tareas asignadas."}
          </p>
        </div>
        <Link href="/projects/new" className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {search ? "No hay resultados" : "No hay proyectos"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search ? `No logramos encontrar nada que coincida con "${search}".` : "Aún no participas en ningún proyecto."}
            </p>
            {search && (
              <Link href="/projects" className="text-[var(--primary)] font-medium underline">
                Limpiar Búsqueda
              </Link>
            )}
          </div>
        ) : (
          displayProjects.map((project: any) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-green-500 transition-all group block">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: project.color || '#166534' }}>
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-gray-400 p-1 flex items-center gap-1 text-sm font-medium">
                      Gestionar <ArrowRight className="w-4 h-4" />
                    </span>
                    <DeleteProjectButton projectId={project.id} projectName={project.name} />
                  </div>
                </div>
                
                <div className="block mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">{project.name}</h3>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                  {project.description || "Sin descripción proporcionada para este proyecto."}
                </p>

                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '---'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Equipo</span>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <div className="flexjustify-between text-xs font-semibold">
                    <span className="text-gray-700">Progreso de Tareas</span>
                    <span className="text-[var(--primary)] float-right">
                      {project.tasks?.length ? Math.round((project.tasks.filter((t: any) => t.status === "COMPLETED").length / project.tasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[var(--primary)] h-1.5 rounded-full" 
                      style={{ width: `${project.tasks?.length ? Math.round((project.tasks.filter((t: any) => t.status === "COMPLETED").length / project.tasks.length) * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-500">
                <span className={`px-2 py-1 rounded-md ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                  {project.status}
                </span>
                <span>{project.tasks?.length || 0} Tareas</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
