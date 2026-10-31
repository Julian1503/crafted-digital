import { requireRole } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default deny: a session with no admin role never sees the shell.
  const session = await requireRole(["admin", "editor", "viewer"]);

  return (
    <AdminShell
      user={{
        name: session?.user?.name ?? "Admin",
        email: session?.user?.email ?? "",
        image: session?.user?.image ?? null,
      }}
    >
      {children}
    </AdminShell>
  );
}
