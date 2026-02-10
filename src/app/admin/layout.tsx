import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AdminShell
      user={{
        name: session.user.name ?? "Admin",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
    >
      {children}
    </AdminShell>
  );
}
