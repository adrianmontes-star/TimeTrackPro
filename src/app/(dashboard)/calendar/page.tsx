import CalendarView from "./CalendarView";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendario de Horas</h1>
        <p className="text-gray-500">Visualiza diariamente el total de horas que ha registrado cada colaborador.</p>
      </div>

      <CalendarView />
    </div>
  );
}
