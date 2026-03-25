"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/server/actions/projects";
import { FolderPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#166534"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await createProject(formData);
    
    setIsLoading(false);
    if (res.success) {
      toast.success("Proyecto creado exitosamente");
      router.push("/projects");
      router.refresh(); // ensure new list is fetched
    } else {
      toast.error(res.error || "Error al crear el proyecto");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/projects" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a Proyectos
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] text-white rounded-lg">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Nuevo Proyecto</h1>
            <p className="text-sm text-gray-500">Completa los detalles para inicializar el proyecto.</p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors"
                placeholder="Ej. Rediseño de Plataforma Web"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-colors resize-none h-32"
                placeholder="Breve descripción de los objetivos del proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color del Proyecto</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-sm text-gray-500 font-mono">{formData.color.toUpperCase()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Link href="/projects" className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </Link>
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm"
              >
                {isLoading ? "Creando..." : "Crear Proyecto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
