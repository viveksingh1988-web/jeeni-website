import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth as nextAuth } from "@/auth";
import { sessionValid, SESSION_COOKIE, isAdminEmail } from "@/lib/cms/auth";
import { StudioLoginClient } from "./login-client";

export const dynamic = "force-dynamic";

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  // Already logged in? Go straight to the site.
  const cookieStore = await cookies();
  const isHmac = sessionValid(cookieStore.get(SESSION_COOKIE)?.value);
  const oauthSession = await nextAuth();
  const isOAuth = isAdminEmail(oauthSession?.user?.email);
  if (isHmac || isOAuth) redirect("/");

  const { error } = await searchParams;

  const providers = {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  };

  const errorMsg =
    error === "AccessDenied"
      ? "Your account is not authorised. Ask the site owner to add your email to ADMIN_EMAILS."
      : error === "OAuthSignin" || error === "OAuthCallback"
        ? "OAuth sign-in failed. Check that the provider credentials are configured."
        : error
          ? "Sign-in error. Please try again."
          : undefined;

  return <StudioLoginClient providers={providers} errorMsg={errorMsg} />;
}
