"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { syncUserAction } from "@/server/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          company: formData.companyName,
          role: "EMPLOYEE",
        },
      },
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message || "Error al crear la cuenta.");
      return;
    }

    if (data.user) {
      // Sync to Prisma Database right away
      const syncRes = await syncUserAction(
        { id: data.user.id, email: data.user.email! },
        { full_name: formData.name, role: "EMPLOYEE" }
      );
      if (!syncRes.success) {
        toast.error("Cuenta creada en Auth, pero fallo la sincronización local.");
      } else {
        toast.success("Cuenta creada exitosamente. Revisa tu email o inicia sesión si la confirmación automática está habilitada.");
        router.push("/login?registered=true");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center">
              <UserPlus size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
              <p className="text-sm text-gray-500">Únete a TimeTrack Pro</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Juan Pérez"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-field"
                placeholder="Acme Corp"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium py-2 px-4 rounded-lg transition-colors mt-6 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Registrarse"
              )}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
