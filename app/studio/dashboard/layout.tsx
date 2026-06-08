import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth as nextAuth } from "@/auth";
import { sessionValid, SESSION_COOKIE, isAdminEmail } from "@/lib/cms/auth";
import { StudioSidebar } from "@/components/studio/studio-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isHmac = sessionValid(cookieStore.get(SESSION_COOKIE)?.value);
  const oauthSession = await nextAuth();
  const isOAuth = isAdminEmail(oauthSession?.user?.email);
  if (!isHmac && !isOAuth) redirect("/studio");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <StudioSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
