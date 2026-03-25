import { MoreHorizontal } from "lucide-react";

export default function TeamCollaboration({ tasks = [] }: { tasks?: any[] }) {


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-[#166534]">Completado</span>;
      case "IN_PROGRESS":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">En Progreso</span>;
      case "PENDING":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Pendiente</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
        <button className="text-gray-400 hover:text-gray-900">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="pb-3 font-medium">Team Member</th>
              <th className="pb-3 font-medium">Task</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-sm text-gray-500">
                  No hay colaboración de equipo reciente.
                </td>
              </tr>
            ) : (
              tasks.map((activity, i) => (
                <tr key={activity.id || i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-100 bg-gray-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {activity.project?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 truncate max-w-[120px]">{activity.project?.name || "General"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-700 font-medium truncate max-w-[120px]">
                    {activity.name}
                  </td>
                  <td className="py-3">
                    {getStatusBadge(activity.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
