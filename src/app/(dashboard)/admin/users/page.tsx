import { getUsers } from "@/server/actions/users";
import { getCurrentUser } from "@/server/actions/time-sessions";
import UserRowActions from "./UserRowActions";
import { ShieldAlert, Users, Mail, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { users } = await getUsers();
  const displayUsers = users || [];

  // Determine if the current logged-in user is an admin
  let isAdmin = false;
  try {
    const currentUser = await getCurrentUser();
    isAdmin = currentUser.role === "ADMIN";
  } catch {
    isAdmin = false;
  }

  // Potential supervisors are users with role SUPERVISOR or ADMIN
  const supervisors = displayUsers.filter((u: any) => u.role === "SUPERVISOR" || u.role === "ADMIN");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra roles, accesos y asignación de supervisores.</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-amber-200">
          <ShieldAlert className="w-4 h-4" />
          Acceso de Administrador
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Directorio ({displayUsers.length})</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Información</th>
                <th className="px-6 py-4">Rol en Sistema</th>
                <th className="px-6 py-4">Supervisor Asignado</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                        {(user.name || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || "Sin nombre"}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Unido el {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </td>

                  {/* The interactive row actions component handles Role and Supervisor */}
                  <UserRowActions user={user} supervisors={supervisors} isAdmin={isAdmin} />

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No se encontraron usuarios registrados en el sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


