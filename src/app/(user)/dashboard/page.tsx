import { getFiles } from "@/app/actions/drive";
import { getSession } from "@/app/actions/auth";
import { DashboardContent } from "@/components/DashboardContent";

export default async function UserDashboardPage() {
  const files = await getFiles(1000);
  const session = await getSession();

  return (
    <DashboardContent 
      initialFiles={files} 
      userName={session?.name || 'Guest'} 
    />
  );
}
