import { tokenOk, isAdminEmail } from "./auth";
import { auth } from "@/auth";

/** Returns true if the request comes from an authenticated admin, regardless
 *  of how they logged in — HMAC session cookie, CMS_TOKEN header, or OAuth. */
export async function isAdminRequest(req: Request): Promise<boolean> {
  if (tokenOk(req)) return true;
  const session = await auth();
  return isAdminEmail(session?.user?.email);
}
