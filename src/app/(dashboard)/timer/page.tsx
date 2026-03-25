import TimerWidget from "@/components/timer/TimerWidget";
import { getMyProjects } from "@/server/actions/projects";
import { getActiveTimeSession, getRecentTimeSessions } from "@/server/actions/time-sessions";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TimerPage() {
  const [{ projects }, { session }, { sessions: recentLogs }] = await Promise.all([
    getMyProjects(),
    getActiveTimeSession(),
    getRecentTimeSessions()
  ]);

  const displayLogs = recentLogs || [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Control de Tiempo</h1>
        <p className="text-gray-500">Registra tus horas de trabajo seleccionando un proyecto y una tarea.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timer */}
        <div className="lg:col-span-1">
          <TimerWidget initialProjects={projects || []} activeSession={session} />
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-700">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Registros Recientes (Hoy)</h2>
            </div>
            
            <div className="overflow-x-auto">
              {displayLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aún no tienes registros de tiempo finalizados.
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Proyecto</th>
                      <th className="px-6 py-4">Tarea</th>
                      <th className="px-6 py-4">Inicio</th>
                      <th className="px-6 py-4">Fin</th>
                      <th className="px-6 py-4 text-right">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{log.project?.name || '---'}</td>
                        <td className="px-6 py-4 text-gray-600">{log.task?.title || '---'}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {log.endTime ? new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-[var(--primary)]">
                          {log.duration ? Math.round(log.duration / 60) : 0} min
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
