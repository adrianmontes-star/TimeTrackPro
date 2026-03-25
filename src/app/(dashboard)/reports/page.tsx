import { getReports } from "@/server/actions/reports";
import { getMyProjects } from "@/server/actions/projects";
import ExportButtons from "./ExportButtons";
import { BarChart3, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { projectId?: string; startDate?: string; endDate?: string }
}) {
  const [{ sessions }, { projects }] = await Promise.all([
    getReports(searchParams),
    getMyProjects()
  ]);

  const displaySessions = sessions || [];
  
  // Calculate summary
  const totalMinutes = displaySessions.reduce((acc: number, curr: any) => acc + (curr.duration ? Math.round(curr.duration / 60) : 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Tiempo</h1>
          <p className="text-gray-500">Visualiza y exporta los registros históricos de horas trabajadas.</p>
        </div>
        
        {/* Export Buttons Client Component */}
        <ExportButtons sessions={displaySessions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              Filtros
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Proyecto</label>
                <select 
                  name="projectId" 
                  defaultValue={searchParams.projectId || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Todos los proyectos</option>
                  {projects?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Desde</label>
                <input 
                  type="date" 
                  name="startDate"
                  defaultValue={searchParams.startDate || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Hasta</label>
                <input 
                  type="date" 
                  name="endDate"
                  defaultValue={searchParams.endDate || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-gray-900 text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Aplicar Filtros
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-[var(--primary)] text-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium opacity-80 mb-1">Total Filtrado</h3>
            <div className="text-4xl font-bold mb-2">{totalHours} <span className="text-lg font-medium opacity-80">hrs</span></div>
            <p className="text-xs opacity-80">En los {displaySessions.length} registros mostrados</p>
          </div>
        </div>

        {/* Results Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                Desglose de Registros
              </h2>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Proyecto / Tarea</th>
                    <th className="px-6 py-4 text-right">Duración</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displaySessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        No se encontraron registros para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    displaySessions.map((session: any) => (
                      <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {new Date(session.startTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {session.user?.name || session.user?.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{session.project?.name || '---'}</div>
                          <div className="text-xs text-gray-500">{session.task?.name || '---'}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-[var(--primary)]">
                          {session.duration ? Math.round(session.duration / 60) : 0} min
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            session.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            session.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {session.approvalStatus === 'PENDING' ? 'PENDIENTE' : 
                             session.approvalStatus === 'APPROVED' ? 'APROBADO' : 'RECHAZADO'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
