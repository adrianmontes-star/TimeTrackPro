"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app we would call a server action here to generate and email token
      // e.g., await sendResetEmail(email);
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      toast.success("Correo enviado");
    } catch (error) {
      toast.error("Ocurrió un error al procesar tu solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-[var(--color-brand-600)]">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisa tu correo</h3>
        <p className="text-gray-600 mb-6">
          Hemos enviado las instrucciones para restablecer tu contraseña a <br/>
          <span className="font-semibold text-gray-900">{email}</span>
        </p>
        <Link 
          href="/login" 
          className="btn-primary w-full"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Recuperar Contraseña</h3>
        <p className="text-sm text-gray-500 mt-1">
          Ingresa tu correo y te enviaremos un enlace
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            placeholder="ejemplo@timetrackpro.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full btn-primary">
            {isLoading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Enviar instrucciones
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        <Link href="/login" className="inline-flex items-center font-medium text-[var(--primary)] hover:text-[var(--color-brand-700)] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al inicio de sesión
        </Link>
      </p>
    </>
  );
}
