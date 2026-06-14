import { getSession } from "@/app/actions/auth";
import { getUserProfile } from "@/app/actions/user";
import { getNotifications } from "@/app/actions/notifications";
import { UserSidebar } from "@/components/UserSidebar";
import { TopBar } from "@/components/TopBar";
import { PageWrapper } from "@/components/PageWrapper";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const profile = await getUserProfile();
  const notifications = await getNotifications();

  return (
    <div className="flex min-h-screen w-full">
      <UserSidebar />
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
