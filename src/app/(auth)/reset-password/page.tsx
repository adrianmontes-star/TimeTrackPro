"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, call action here logic to verify token and update pass
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      toast.success("Contraseña actualizada exitosamente");
    } catch (error) {
      toast.error("Token inválido o expirado. Solicita otro enlace.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-[var(--color-brand-600)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Todo listo!</h3>
        <p className="text-gray-600 mb-6">
          Tu contraseña ha sido actualizada correctamente. Ya puedes acceder a tu cuenta.
        </p>
        <Link href="/login" className="btn-primary w-full">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Nueva Contraseña</h3>
        <p className="text-sm text-gray-500 mt-1">
          Ingresa tu nueva contraseña para TimeTrack Pro
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            className="input-field"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="input-field"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isLoading} className="w-full btn-primary">
            {isLoading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Guardar Contraseña
          </button>
        </div>
      </form>
    </>
  );
}
