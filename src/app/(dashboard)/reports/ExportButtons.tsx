"use client";

import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ExportButtons({ sessions }: { sessions: any[] }) {
  
  const handleExportCSV = () => {
    if (!sessions || sessions.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const headers = ["Fecha", "Usuario", "Proyecto", "Tarea", "Duracion (Minutos)", "Estado", "Notas"];
    const rows = sessions.map(s => [
      new Date(s.startTime).toLocaleDateString(),
      s.user?.name || s.user?.email || "N/A",
      s.project?.name || "N/A",
      s.task?.name || "N/A",
      s.duration ? Math.round(s.duration / 60).toString() : "0",
      s.approvalStatus,
      `"${(s.description || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `timetrack_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV exportado exitosamente");
  };

  const handleExportPDF = () => {
    if (!sessions || sessions.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Reporte de Registro de Tiempos - TimeTrack Pro", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 30);
      
      const tableColumn = ["Fecha", "Usuario", "Proyecto", "Duracion (Min)", "Estado"];
      const tableRows = sessions.map(s => [
        new Date(s.startTime).toLocaleDateString(),
        s.user?.name || s.user?.email || "N/A",
        s.project?.name || "N/A",
        s.duration ? Math.round(s.duration / 60).toString() : "0",
        s.approvalStatus
      ]);

      (doc as any).autoTable({
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 101, 52] } // primary green color
      });

      doc.save(`timetrack_report_${new Date().getTime()}.pdf`);
      toast.success("PDF generado exitosamente");
    } catch (err) {
      toast.error("Error al generar el PDF. Verifica dependencias.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleExportCSV}
        className="bg-white border text-gray-700 border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
      >
        <Download className="w-4 h-4" />
        Exportar CSV
      </button>
      <button 
        onClick={handleExportPDF}
        className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
      >
        <FileText className="w-4 h-4" />
        Exportar PDF
      </button>
    </div>
  );
}
