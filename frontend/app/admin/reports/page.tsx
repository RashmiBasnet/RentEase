import { handleGetAllReports } from "@/lib/actions/report-action";
import { ReportsManager } from "./_components/ReportsManager";

export default async function AdminReportsPage() {
  const res = await handleGetAllReports();
  const reports: any[] = res.data?.reports ?? [];

  return <ReportsManager reports={reports} />;
}
