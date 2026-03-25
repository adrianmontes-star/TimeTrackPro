import { getCurrentUser } from "@/server/actions/time-sessions";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500">Actualiza tu información personal y preferencias de la cuenta.</p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
