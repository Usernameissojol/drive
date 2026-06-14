import { getSession } from "@/app/actions/auth";
import { getUserProfile } from "@/app/actions/user";
import { getNotifications } from "@/app/actions/notifications";
import { AdminSidebar } from "@/components/AdminSidebar";
import { TopBar } from "@/components/TopBar";
import { PageWrapper } from "@/components/PageWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const profile = await getUserProfile();
  const notifications = await getNotifications();

  return (
    <div className="admin-theme flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {session && (
          <TopBar 
            session={session} 
            profile={profile} 
            initialNotifications={notifications} 
          />
        )}
        <PageWrapper>
          {children}
        </PageWrapper>
      </div>
    </div>
  );
}
