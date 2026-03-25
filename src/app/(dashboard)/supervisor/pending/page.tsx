import { getPendingApprovals } from "@/server/actions/approvals";
import ApprovalActions from "./ApprovalActions";
import { ClipboardCheck, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PendingApprovalsPage() {
  const { sessions } = await getPendingApprovals();
  const displaySessions = sessions || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aprobaciones Pendientes</h1>
          <p className="text-gray-500">Revisa los registros de tiempo de tu equipo subordinado.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Por Revisar ({displaySessions.length})</h2>
          </div>
          <div className="relative">
             <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
             <input type="text" placeholder="Buscar empleado..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {displaySessions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Todo al día</h3>
              <p className="text-gray-500">No hay registros de tiempo pendientes de aprobación por tu equipo.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Empleado</th>
                  <th className="px-6 py-4">Fecha y Duración</th>
                  <th className="px-6 py-4">Proyecto y Tarea</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displaySessions.map((session: any) => (
                  <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{session.user?.name || session.user?.email}</div>
                      <div className="text-xs text-gray-500 capitalize">{session.user?.role?.toLowerCase() || 'Empleado'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {new Date(session.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-[var(--primary)] font-semibold mt-0.5">
                        {session.duration ? Math.round(session.duration / 60) : 0} min total
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{session.project?.name || '---'}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{session.task?.name || '---'}</div>
                      {session.description && (
                        <div className="mt-1 text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
                          "{session.description}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ApprovalActions sessionId={session.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
