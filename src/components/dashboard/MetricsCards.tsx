import { ArrowUpRight } from "lucide-react";

export default function MetricsCards({ metrics }: { metrics?: any }) {
  const m = metrics || { totalProjects: 0, endedProjects: 0, runningProjects: 0, pendingProjects: 0 };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Projects Card (Green) */}
      <div className="bg-[#166534] rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h3 className="font-medium">Total Projects</h3>
        </div>
        <div className="relative z-10">
          <p className="text-5xl font-bold tracking-tight mb-4">{m.totalProjects}</p>
          <div className="text-sm text-green-100 mt-2">
            Proyectos registrados en el sistema
          </div>
        </div>
      </div>

      {/* Ended Projects Card */}
      <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-medium text-gray-900">Ended Projects</h3>
        </div>
        <div>
          <p className="text-5xl font-bold tracking-tight text-gray-900 mb-4">{m.endedProjects}</p>
          <div className="text-sm text-gray-500 mt-2">
            Completados con éxito
          </div>
        </div>
      </div>

      {/* Running Projects Card */}
      <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-medium text-gray-900">Running Projects</h3>
        </div>
        <div>
          <p className="text-5xl font-bold tracking-tight text-gray-900 mb-4">{m.runningProjects}</p>
          <div className="text-sm text-gray-500 mt-2">
            En desarrollo activo
          </div>
        </div>
      </div>

      {/* Pending Project Card */}
      <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-medium text-gray-900">Pending Project</h3>
        </div>
        <div>
          <p className="text-5xl font-bold tracking-tight text-gray-900 mb-4">{m.pendingProjects}</p>
          <div className="text-sm text-gray-500 mt-2">
            A la espera de iniciar
          </div>
        </div>
      </div>
    </div>
  );
}
