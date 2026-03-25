import { getMyProjects } from "@/server/actions/projects";
import { getRecentTimeSessions, deleteTimeSession } from "@/server/actions/time-sessions";
import ManualTimeEntryForm from "./ManualTimeEntryForm";
import { Clock, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function TimeEntriesPage() {
  const [{ projects }, { sessions }] = await Promise.all([
    getMyProjects(),
    getRecentTimeSessions()
  ]);

  const handleDelete = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteTimeSession(id);
    revalidatePath("/time-entries");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Registros de Tiempo</h1>
        <p className="text-gray-500">Añade tiempo manualmente o revisa tu historial reciente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Manual Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-[var(--primary)]/10 rounded-lg text-[var(--primary)]">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Entrada Manual</h2>
            </div>
            <div className="p-6">
              <ManualTimeEntryForm projects={projects || []} />
            </div>
          </div>
        </div>

        {/* Right Column: History table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Historial Detallado</h2>
            </div>
            
            <div className="overflow-x-auto">
              {(!sessions || sessions.length === 0) ? (
                <div className="p-8 text-center text-gray-500">
                  Aún no tienes registros de tiempo.
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Proyecto / Tarea</th>
                      <th className="px-6 py-4">Horario</th>
                      <th className="px-6 py-4">Duración</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sessions.map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {new Date(log.startTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{log.project?.name || '---'}</div>
                          <div className="text-xs text-gray-500">{log.task?.title || '---'}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {log.endTime ? new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                        </td>
                        <td className="px-6 py-4 font-medium text-[var(--primary)]">
                          {log.durationMinutes} min
                        </td>
                        <td className="px-6 py-4 text-center">
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={log.id} />
                            <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
