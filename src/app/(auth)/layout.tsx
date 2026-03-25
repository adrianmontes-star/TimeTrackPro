import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auntenticación | TimeTrack Pro",
  description: "Inicia sesión en TimeTrack Pro",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background shapes mimicking the image's green waves */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--color-brand-500)] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            TimeTrack Pro
          </h2>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-[var(--color-brand-100)] sm:rounded-2xl sm:px-10 border border-[var(--color-brand-100)]">
          {children}
        </div>
      </div>
    </div>
  );
}
