"use client";

import { useState } from "react";
import { updateProfile } from "@/server/actions/profile";
import { toast } from "sonner";
import { Save, UserCircle, Mail } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "");
  const [language, setLanguage] = useState(user.language || "es");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await updateProfile({ name, language });
    setIsLoading(false);
    
    if (res.success) {
      toast.success("Perfil actualizado con éxito");
    } else {
      toast.error(res.error || "Error al actualizar perfil");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex items-center gap-6 bg-gray-50/50">
        <div className="w-24 h-24 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-3xl font-bold shadow-inner">
          {(name || user.email || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{name || "Usuario"}</h2>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 uppercase">
              {user.role}
            </span>
            <span className="text-sm text-gray-500">
              Miembro desde {new Date(user.createdAt).getFullYear()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-gray-400" />
            Información Personal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">El correo electrónico está bloqueado por el proveedor de identidad.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idioma Preferido</label>
              <select 
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
              >
                <option value="es">Español (ES)</option>
                <option value="en">English (US)</option>
                <option value="pt">Português (BR)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
