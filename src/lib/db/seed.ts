import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const modules = ["content", "crm", "billing", "system"];
const actions = ["read", "create", "update", "delete"];

(async () => {
  console.log("🌱 Seeding database...");

  try {
    // ─── Permissions ────────────────────────────────────────────────────
    const permissions: Record<string, string> = {};

    for (const mod of modules) {
      for (const action of actions) {
        const perm = await prisma.permission.upsert({
          where: { module_action: { module: mod, action } },
          update: {},
          create: { module: mod, action },
        });
        permissions[`${mod}:${action}`] = perm.id;
      }
    }

    console.log(`✅ Created ${Object.keys(permissions).length} permissions`);

    // ─── Roles ──────────────────────────────────────────────────────────
    const adminRole = await prisma.role.upsert({
      where: { name: "admin" },
      update: { description: "Full system access" },
      create: { name: "admin", description: "Full system access" },
    });

    const editorRole = await prisma.role.upsert({
      where: { name: "editor" },
      update: { description: "Content management access" },
      create: { name: "editor", description: "Content management access" },
    });

    const viewerRole = await prisma.role.upsert({
      where: { name: "viewer" },
      update: { description: "Read-only access" },
      create: { name: "viewer", description: "Read-only access" },
    });

    console.log("✅ Created roles: admin, editor, viewer");

    // ─── Role-Permission assignments ───────────────────────────────────
    for (const permId of Object.values(permissions)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permId } },
        update: {},
        create: { roleId: adminRole.id, permissionId: permId },
      });
    }

    const editorPerms = ["content:read", "content:create", "content:update"];
    for (const key of editorPerms) {
      const permId = permissions[key];
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: editorRole.id, permissionId: permId } },
        update: {},
        create: { roleId: editorRole.id, permissionId: permId },
      });
    }

    const viewerPerms = ["content:read"];
    for (const key of viewerPerms) {
      const permId = permissions[key];
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: viewerRole.id, permissionId: permId } },
        update: {},
        create: { roleId: viewerRole.id, permissionId: permId },
      });
    }

    console.log("✅ Assigned permissions to roles");

    // ─── Default admin user ────────────────────────────────────────────
    const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@crafted.dev" },
      update: { name: "Admin", active: true },
      create: {
        name: "Admin",
        email: "admin@crafted.dev",
        hashedPassword,
        active: true,
      },
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });

    console.log("✅ Created admin user: admin@crafted.dev");

    // ─── Default integrations ─────────────────────────────────────────
    const integrations = [
      { name: "stripe", enabled: false, status: "disconnected" },
      { name: "resend", enabled: false, status: "disconnected" },
      { name: "analytics", enabled: false, status: "disconnected" },
    ];

    for (const integration of integrations) {
      await prisma.integration.upsert({
        where: { name: integration.name },
        update: { enabled: integration.enabled, status: integration.status },
        create: integration,
      });
    }

    console.log("✅ Created default integrations");

    // ─── Default site settings ────────────────────────────────────────
    const settings = [
      { key: "siteName", value: "Crafted Digital", group: "general" },
      { key: "siteDescription", value: "Digital agency website", group: "general" },
      { key: "contactEmail", value: "hello@crafted.dev", group: "general" },
      { key: "contactPhone", value: "", group: "general" },
      { key: "address", value: "", group: "general" },
      { key: "socialTwitter", value: "", group: "social" },
      { key: "socialLinkedin", value: "", group: "social" },
      { key: "socialGithub", value: "", group: "social" },
      { key: "analyticsId", value: "", group: "integrations" },
      { key: "maintenanceMode", value: "false", group: "system" },
    ];

    for (const setting of settings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value, group: setting.group },
        create: setting,
      });
    }

    console.log("✅ Created default site settings");
    console.log("🎉 Seed complete!");
  } finally {
    await prisma.$disconnect();
  }
})();
