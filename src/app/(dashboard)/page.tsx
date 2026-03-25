import MetricsCards from "@/components/dashboard/MetricsCards";
import ProjectAnalytics from "@/components/dashboard/ProjectAnalytics";
import Reminders from "@/components/dashboard/Reminders";
import ProjectList from "@/components/dashboard/ProjectList";
import TeamCollaboration from "@/components/dashboard/TeamCollaboration";
import ProjectProgress from "@/components/dashboard/ProjectProgress";
import TimerWidget from "@/components/timer/TimerWidget";
import { getDashboardMetrics } from "@/server/actions/dashboard";
import { getCurrentUser, getActiveTimeSession } from "@/server/actions/time-sessions";
import { getMyProjects } from "@/server/actions/projects";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [user, dashboardData, projectsData, sessionData] = await Promise.all([
    getCurrentUser(),
    getDashboardMetrics(),
    getMyProjects(),
    getActiveTimeSession()
  ]);

  const data = dashboardData.data;
  const metrics = data?.metrics || { totalProjects: 0, endedProjects: 0, runningProjects: 0, pendingProjects: 0, completionRate: 0 };
  const recentProjects = data?.recentProjects || [];
  const analytics = data?.analytics || [];
  const latestTasks = data?.latestTasks || [];

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Hola {(user as any)?.name?.split(" ")[0] || "Administrador"}, bienvenido de vuelta a TimeTrack Pro
          </p>
        </div>
      </div>

      {/* Row 1: Metrics */}
      <MetricsCards metrics={metrics} />

      {/* Row 2: Analytics & Reminders & Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-6 h-[250px] lg:h-auto">
          <ProjectAnalytics data={analytics} />
        </div>
        <div className="lg:col-span-3">
          <Reminders tasks={latestTasks} />
        </div>
        <div className="lg:col-span-3">
          <TimerWidget initialProjects={projectsData?.projects || []} activeSession={sessionData?.session} />
        </div>
      </div>

      {/* Row 3: Lists & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 max-h-[400px]">
          <ProjectList projects={recentProjects} />
        </div>
        <div className="lg:col-span-5 max-h-[400px] overflow-y-auto rounded-2xl border border-gray-100 bg-white">
          <TeamCollaboration tasks={latestTasks} />
        </div>
        <div className="lg:col-span-3 max-h-[400px]">
          <ProjectProgress rate={metrics.completionRate} />
        </div>
      </div>
    </div>
  );
}
