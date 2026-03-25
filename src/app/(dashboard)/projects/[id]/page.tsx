import { getProjectById } from "@/server/actions/projects";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, CheckCircle2, Circle, Clock } from "lucide-react";
import NewTaskForm from "./NewTaskForm";
import TaskStatusSelect from "./TaskStatusSelect"; // We will create this client component

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { success, project, error } = await getProjectById(id);

  if (!success || !project) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Error de Acceso</h2>
          <p>{error || "No pudimos cargar este proyecto o no tienes autorización."}</p>
          <Link href="/projects" className="underline mt-4 inline-block text-red-800">Volver a Proyectos</Link>
        </div>
      </div>
    );
  }

  const completedTasks = project.tasks.filter((t: any) => t.status === "COMPLETED").length;
    const progressPercent = project.tasks.length > 0 ? Math.round((completedTasks / project.tasks.length) * 100) : 0;

    return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header and Back navigation */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-dark)] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a Proyectos
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: project.color || '#166534' }}>
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {project.status === 'ACTIVE' ? 'ACTIVO' : project.status === 'COMPLETED' ? 'FINALIZADO' : project.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center px-4 border-r border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{project.tasks.length}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tareas totales</div>
          </div>
          <div className="text-center px-4 border-r border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{project.members.length}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Miembros</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl font-bold text-[var(--primary)]">{progressPercent}%</div>
            <div className="text-xs text-[var(--primary)] font-medium uppercase tracking-wider">Progreso</div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 max-w-3xl leading-relaxed">
        {project.description || "Este proyecto no tiene una descripción detallada."}
      </p>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Tareas del Proyecto</h2>
              <span className="text-sm text-gray-500 font-medium">{completedTasks} completadas</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {project.tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aún no has añadido tareas a este proyecto.
                </div>
              ) : (
                project.tasks.map((task: any) => (
                  <div key={task.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start gap-4">
                      {task.status === "COMPLETED" ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`font-semibold ${task.status === "COMPLETED" ? "text-gray-400 line-through" : "text-gray-900"}`}>
                          {task.name}
                        </h4>
                        {task.description && (
                          <p className={`text-sm mt-1 mb-3 ${task.status === "COMPLETED" ? "text-gray-400" : "text-gray-600"}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-2">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> SIN REGISTRO</span>
                        </div>
                      </div>
                    </div>
                    {/* Status Select Component */}
                    <div className="shrink-0 ml-4 opacity-50 group-hover:opacity-100 transition-opacity">
                       <TaskStatusSelect taskId={task.id} projectId={project.id} initialStatus={task.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Add Task & Team */}
        <div className="space-y-6">
          <NewTaskForm projectId={project.id} />
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Equipo del Proyecto
            </h3>
            <div className="space-y-4">
              {project.members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">
                    {(member.user?.name || member.user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.user?.name || member.user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.user?.role?.toLowerCase() || 'Miembro'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-2 border border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-lg text-sm font-medium transition-colors">
              + Añadir Miembro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
