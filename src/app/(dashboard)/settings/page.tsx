import { getWorkdayConfig } from "@/server/actions/settings";
import { getCurrentUser } from "@/server/actions/time-sessions";
import SettingsForm from "./SettingsForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") {
    redirect("/"); // Only admins can see global settings
  }

  const { config } = await getWorkdayConfig();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración Global</h1>
        <p className="text-gray-500">Ajusta los parámetros laborales estándar de la empresa.</p>
      </div>

      <SettingsForm initialConfig={config} />
    </div>
  );
}
