"use client";

import { useState } from "react";
import { updateUserRole, assignSupervisor } from "@/server/actions/users";
import { toast } from "sonner";
import { Shield, User as UserIcon } from "lucide-react";

export default function UserRowActions({ user, supervisors }: { user: any, supervisors: any[] }) {
  const [role, setRole] = useState(user.role);
  const [supervisorId, setSupervisorId] = useState(user.supervisorId || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Exclude self from supervisor list
  const availableSupervisors = supervisors.filter(s => s.id !== user.id);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    setIsUpdating(true);
    
    const res = await updateUserRole(user.id, newRole);
    if (res.success) {
      toast.success("Rol actualizado con éxito");
    } else {
      toast.error(res.error || "Fallo al actualizar rol");
      setRole(user.role); // revert
    }
    setIsUpdating(false);
  };

  const handleSupervisorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSupId = e.target.value;
    setSupervisorId(newSupId);
    setIsUpdating(true);
    
    // Convert empty string back to null
    const targetId = newSupId === "" ? null : newSupId;
    
    const res = await assignSupervisor(user.id, targetId);
    if (res.success) {
      toast.success("Supervisor asignado con éxito");
    } else {
      toast.error(res.error || "Fallo al asignar supervisor");
      setSupervisorId(user.supervisorId || ""); // revert
    }
    setIsUpdating(false);
  };

  return (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {role === "ADMIN" ? (
            <Shield className="w-4 h-4 text-amber-500" />
          ) : (
            <UserIcon className="w-4 h-4 text-gray-400" />
          )}
          <select
            value={role}
            onChange={handleRoleChange}
            disabled={isUpdating}
            className={`text-xs font-semibold py-1.5 px-2 rounded-lg border outline-none appearance-none cursor-pointer group-hover:bg-white transition-colors ${
              role === "ADMIN" ? "bg-amber-50 text-amber-700 border-amber-200" :
              role === "SUPERVISOR" ? "bg-blue-50 text-blue-700 border-blue-200" :
              "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            <option value="EMPLOYEE">Empleado</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      </td>

      <td className="px-6 py-4">
        <select
          value={supervisorId}
          onChange={handleSupervisorChange}
          disabled={isUpdating || role === "ADMIN"}
          className="w-full text-xs text-gray-700 py-1.5 px-2 rounded-lg border border-gray-200 bg-gray-50 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[var(--primary)] hover:bg-white transition-colors disabled:opacity-50"
        >
          <option value="">-- Sin supervisor --</option>
          {availableSupervisors.map(s => (
            <option key={s.id} value={s.id}>{s.name || s.email}</option>
          ))}
        </select>
      </td>
    </>
  );
}
