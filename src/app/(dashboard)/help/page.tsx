import { HelpCircle, HardHat } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[75vh] text-center p-8">
      <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <HelpCircle className="w-12 h-12 text-purple-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
        Centro de Ayuda
        <HardHat className="text-yellow-500 w-8 h-8" />
      </h1>
      <p className="text-gray-500 max-w-md mx-auto text-lg">
        Esta sección se encuentra actualmente en desarrollo y será parte de la próxima versión.
      </p>
      <div className="mt-8">
        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
          Próximamente v2.0
        </span>
      </div>
    </div>
  );
}
