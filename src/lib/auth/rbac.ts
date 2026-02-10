import { auth } from "./auth";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "editor" | "viewer";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const roles = ((session as any).roles as string[]) || [];
  const hasRole = roles.some((r) => allowedRoles.includes(r as UserRole));
  if (!hasRole) redirect("/admin?error=forbidden");
  return session;
}

export async function getUserRoles(): Promise<string[]> {
  const session = await auth();
  if (!session) return [];
  return (session as any).roles || [];
}

export async function hasPermission(requiredRole: UserRole): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.includes(requiredRole) || roles.includes("admin");
}

export function checkApiAuth(
  roles: string[],
  allowedRoles: UserRole[]
): boolean {
  return (
    roles.some((r) => allowedRoles.includes(r as UserRole)) ||
    roles.includes("admin")
  );
}
