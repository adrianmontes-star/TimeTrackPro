"use client";

import { useState } from "react";
import { resolveApproval } from "@/server/actions/approvals";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function ApprovalActions({ sessionId }: { sessionId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setIsProcessing(true);
    let comment = undefined;

    if (status === "REJECTED") {
      const reason = prompt("Razón del rechazo (opcional):");
      if (reason === null) {
        setIsProcessing(false);
        return; // User cancelled the prompt
      }
      comment = reason;
    }

    const res = await resolveApproval(sessionId, status, comment);
    setIsProcessing(false);

    if (res.success) {
      toast.success(`Registro ${status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}`);
    } else {
      toast.error(res.error || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={isProcessing}
        title="Rechazar"
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleAction("APPROVED")}
        disabled={isProcessing}
        title="Aprobar"
        className="p-2 text-[var(--primary)] hover:text-white hover:bg-[var(--primary)] rounded-lg transition-colors disabled:opacity-50 border border-[var(--primary)]/20 shadow-sm"
      >
        <Check className="w-5 h-5" />
      </button>
    </div>
  );
}
