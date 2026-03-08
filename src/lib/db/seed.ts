import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import {slugify} from "@/lib/utils";
import {MediaProvider} from "@/generated/prisma/enums";

const modules = ["content", "crm", "billing", "system"];
const actions = ["read", "create", "update", "delete"];
const industries = [
  "Architecture",
  "Construction",
  "Real Estate",
  "Property Development",
  "Interior Design",
  "Engineering",
  "Education",
  "E Learning",
  "Health Care",
  "Mental Health",
  "Aged Care",
  "Disability Services",
  "Fitness and Wellness",
  "Beauty",
  "Hospitality",
  "Food and Beverage",
  "Travel and Tourism",
  "Events",
  "Retail",
  "Fashion",
  "Luxury Goods",
  "Consumer Goods",
  "Automotive",
  "Logistics",
  "Transportation",
  "Manufacturing",
  "Industrial",
  "Mining",
  "Energy",
  "Renewable Energy",
  "Agriculture",
  "FinTech",
  "Banking",
  "Insurance",
  "Legal",
  "Accounting",
  "Human Resources",
  "Recruitment",
  "SaaS",
  "Software Development",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Data Analytics",
  "Telecommunications",
  "Media and Entertainment",
  "Marketing and Advertising",
  "Creative Agency",
  "Nonprofit",
  "Government",
  "Public Sector",
  "Community Services",
  "Ecommerce",
  "Marketplace",
  "Professional Services",
  "Consulting",
  "Project Management",
  "Research",
  "Biotechnology",
  "Pharmaceuticals",
  "Environmental Services",
  "Sports",
  "Pet Care",
];
const mediaAssets = [
  {
    id: "cmmafzuik000b3kvj7w1ov6yj",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532349/crafted-digital/file_oagrmb.png",
    filename: "Screenshot 2026-03-03 200504.png",
    mimeType: "image/png",
    size: 1141617,
    width: 1900,
    height: 920,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_oagrmb",
    providerPath: "crafted-digital",
    thumbnailUrl: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532349/crafted-digital/file_oagrmb.png",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-03T10:05:50.012+00:00"),
    updatedAt: new Date("2026-03-03T10:05:50.012+00:00"),
  },
  {
    id: "cmmag3n0m000d3kvjyqq8rbqv",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532526/crafted-digital/file_ojznvr.png",
    filename: "Screenshot 2026-03-03 200758.png",
    mimeType: "image/png",
    size: 313067,
    width: 1687,
    height: 683,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_ojznvr",
    providerPath: "crafted-digital",
    thumbnailUrl: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532526/crafted-digital/file_ojznvr.png",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-03T10:08:46.918+00:00"),
    updatedAt: new Date("2026-03-03T10:08:46.918+00:00"),
  },
  {
    id: "cmmag3p0h000f3kvj0qd59o84",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532529/crafted-digital/file_vqahq7.png",
    filename: "Screenshot 2026-03-03 200821.png",
    mimeType: "image/png",
    size: 880194,
    width: 1662,
    height: 746,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_vqahq7",
    providerPath: "crafted-digital",
    thumbnailUrl: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532529/crafted-digital/file_vqahq7.png",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-03T10:08:49.505+00:00"),
    updatedAt: new Date("2026-03-03T10:08:49.505+00:00"),
  },
  {
    id: "cmmehex780000oovjh09lasdf",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772776596/crafted-digital/file_j41kfr.jpg",
    filename: "hero-3.jpg",
    mimeType: "image/jpeg",
    size: 4014399,
    width: 6000,
    height: 4000,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_j41kfr",
    providerPath: "crafted-digital",
    thumbnailUrl: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772776596/crafted-digital/file_j41kfr.jpg",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-06T05:56:37.651+00:00"),
    updatedAt: new Date("2026-03-06T05:56:37.651+00:00"),
  },
  {
    id: "cmmei9z3i0003oovjfmaqxde9",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772778045/crafted-digital/file_phctvf.png",
    filename: "hero-1.png",
    mimeType: "image/png",
    size: 7030791,
    width: 2880,
    height: 1472,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_phctvf",
    providerPath: "crafted-digital",
    thumbnailUrl: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772778045/crafted-digital/file_phctvf.png",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-06T06:20:46.446+00:00"),
    updatedAt: new Date("2026-03-06T06:20:46.446+00:00"),
  },
];
const caseStudies = [
  {
    id: "cmmag3tnq000h3kvj5jyf6zi5",
    title: "Transforming AI4L's Digital Presence from Fragile to Scalable",
    slug: "ai4l-automation-and-web-platform",
    summary:
        "Helped AI4L — a non-technical AI education startup — regain control of their web platform, automate their communication workflows, and add AI-powered features that let them focus on teaching instead of managing tools.",
    body: `{
        "challenge": "AI4L was a growing education startup teaching non-technical professionals how to use AI in their daily work. Despite having a functional website built with Lovable, the team faced a critical operational problem: the project lived in the account of a third party they couldn't easily reach, leaving them unable to make updates, fix issues, or iterate on their platform independently. On top of that, all their course communications — enrollments, follow-ups, event reminders — were being handled manually, creating a bottleneck that didn't scale as their audience grew.",
        "approach": [
          "Coming from the same AI diploma program where Mohammed taught, I had firsthand context into the business and its audience. Rather than proposing a full rebuild, I focused on quick wins that would unblock the team immediately and layer in automation over time. The priority was restoring ownership first, then systematizing the repetitive work, and finally adding intelligent features that would differentiate their platform."
        ],
        "solution": "I migrated the Lovable project into the team's own account so they had full autonomy going forward — no more dependency on a third party. From there I built out email automation flows covering course enrollments, event reminders, and lead nurturing for their contact list. I then developed two new features directly on their site: a newsletter subscription system to grow and own their audience, and an AI-powered chatbot that could answer common questions about their courses and AI topics — reducing the support load on Mohammed and the team. Throughout the engagement I also acted as an informal advisor, helping them evaluate new tools and opportunities as they came up, drawing from both my technical background and my understanding of their specific market.",
        "results": [
          "Full platform ownership restored — team can now update and iterate independently without third-party dependency",
          "Email workflows fully automated across course enrollments, event follow-ups, and contact nurturing",
          "Newsletter system launched and actively growing their owned audience",
          "AI chatbot deployed on-site handling FAQs and course inquiries 24/7",
          "Reduced manual operational workload, freeing Mohammed to focus on content and teaching"
        ],
        "technologies": [
          "Lovable",
          "Make (Zapier alternative)",
          "OpenAI API",
          "Email Automation",
          "AI Chatbot"
        ],
        "testimonial": {
          "quote": "Having someone who understood both the technical side and our audience made a huge difference. We went from being stuck to having a platform we actually own and a system that runs itself in the background.",
          "author": "Mohammed",
          "role": "Founder, AI4L"
        }
      }`,
    coverImage:
      "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772776596/crafted-digital/file_j41kfr.jpg",
    gallery: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532349/crafted-digital/file_oagrmb.png, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532526/crafted-digital/file_ojznvr.png, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532529/crafted-digital/file_vqahq7.png",
    status: "published",
    publishedAt: new Date("2026-02-01T00:00:00.000+00:00"),
    featured: true,
    sortOrder: 1437,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-03T10:08:55.525+00:00"),
    updatedAt: new Date("2026-03-06T05:56:43.604+00:00"),
  },
  {
    id: "cmmeieu1v0005oovjaok9r6gt",
    title: "Architect Portfolio Website",
    slug: "architect-portfolio-website",
    summary:
        "A refined portfolio website designed for an architect to showcase selected projects through clean layouts, strong visual storytelling, and a premium editorial feel.",
    body:
        "Designed and developed a refined portfolio website for an architect, focused on showcasing projects with clarity, elegance, and strong visual hierarchy. The experience was built to reflect the architect’s design philosophy through a minimalist interface, immersive imagery, and thoughtful typography. The result is a professional digital presence that highlights selected works, communicates expertise, and makes it easy for potential clients and collaborators to explore the studio’s approach and capabilities.",
    coverImage:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772778045/crafted-digital/file_phctvf.png",
    gallery: "",
    status: "published",
    publishedAt: new Date("2025-01-01T00:00:00.000+00:00"),
    featured: true,
    sortOrder: 2437,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-06T06:24:33.186+00:00"),
    updatedAt: new Date("2026-03-06T06:24:33.186+00:00"),
  },
];
const tools = [
  "Figma",
  "FigJam",
  "Framer",
  "Webflow",
  "WordPress",
  "Shopify",
  "Canva",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
  "Adobe XD",
  "Adobe After Effects",
  "Adobe Premiere Pro",
  "Adobe Lightroom",
  "Sketch",
  "Miro",
  "Notion",
  "Airtable",
  "Trello",
  "Asana",
  "Monday.com",
  "Jira",
  "ClickUp",
  "Slack",
  "Microsoft Teams",
  "Zoom",
  "Google Workspace",
  "Microsoft 365",
  "HubSpot",
  "Salesforce",
  "Mailchimp",
  "Klaviyo",
  "Resend",
  "Stripe",
  "Xero",
  "QuickBooks",
  "Zapier",
  "Make",
  "n8n",
  "Supabase Studio",
  "Prisma Studio",
  "Postman",
  "Insomnia",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Vercel",
  "Netlify",
  "Cloudinary",
  "ImageKit",
  "Storybook",
  "Cypress",
  "Playwright",
  "Jest",
  "Vitest",
  "Docker Desktop",
  "Kubernetes Dashboard",
  "Revit",
  "AutoCAD",
  "SketchUp",
  "Rhino",
  "Enscape",
  "Lumion",
  "ArchiCAD",
  "BIM 360",
];
const technologies = [
  "HTML",
  "CSS",
  "Sass",
  "Tailwind CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "Angular",
  "Svelte",
  "SvelteKit",
  "Node.js",
  "Express.js",
  "NestJS",
  "Java",
  "Spring Boot",
  "Python",
  "FastAPI",
  "Django",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "Ruby on Rails",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "React Native",
  "Flutter",
  "Electron",
  "tRPC",
  "GraphQL",
  "REST API",
  "Prisma",
  "PostgreSQL",
  "MySQL",
  "MariaDB",
  "SQLite",
  "MongoDB",
  "Redis",
  "Firebase",
  "Supabase",
  "Docker",
  "Kubernetes",
  "Terraform",
  "AWS",
  "Azure",
  "Google Cloud",
  "Cloudflare",
  "Vercel",
  "Netlify",
  "GitHub Actions",
  "CI/CD",
  "Stripe API",
  "Resend API",
  "OpenAI API",
  "Anthropic API",
  "WebSockets",
  "Socket.IO",
  "Zod",
  "Redux",
  "TanStack Query",
  "shadcn/ui",
  "Radix UI",
  "Material UI",
  "Bootstrap",
  "Three.js",
  "D3.js",
  "Chart.js",
  "Recharts",
  "Playwright",
  "Cypress",
  "Jest",
  "Vitest",
  "Testing Library",
  "pnpm",
  "Turborepo",
  "Nx",
  "Sanity",
  "Contentful",
  "Strapi",
  "WordPress API",
  "Algolia",
  "Elasticsearch",
  "WebRTC",
  "PWA",
  "Service Workers",
  "Framer Motion",
  "Motion",
];

(async () => {
  console.log("🌱 Seeding database...");

  try {
    // ─── Media assets ───────────────────────────────────────────────────
    for (const asset of mediaAssets) {
      await prisma.mediaAsset.upsert({
        where: { id: asset.id },
        update: {
          url: asset.url,
          filename: asset.filename,
          mimeType: asset.mimeType,
          size: asset.size,
          width: asset.width,
          height: asset.height,
          alt: asset.alt,
          title: asset.title,
          tags: asset.tags,
          folder: asset.folder,
          provider: asset.provider,
          providerFileId: asset.providerFileId,
          providerPath: asset.providerPath,
          thumbnailUrl: asset.thumbnailUrl,
          createdBy: asset.createdBy,
          deleted: asset.deleted,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
        },
        create: {
          id: asset.id,
          url: asset.url,
          filename: asset.filename,
          mimeType: asset.mimeType,
          size: asset.size,
          width: asset.width,
          height: asset.height,
          alt: asset.alt,
          title: asset.title,
          tags: asset.tags,
          folder: asset.folder,
          provider: asset.provider,
          providerFileId: asset.providerFileId,
          providerPath: asset.providerPath,
          thumbnailUrl: asset.thumbnailUrl,
          createdBy: asset.createdBy,
          deleted: asset.deleted,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
        },
      });
    }

    console.log(`✅ Created ${mediaAssets.length} media assets`);

    // ─── Case studies ───────────────────────────────────────────────────
    for (const item of caseStudies) {
      await prisma.caseStudy.upsert({
        where: { slug: item.slug },
        update: {
          id: item.id,
          title: item.title,
          summary: item.summary,
          body: item.body,
          coverImage: item.coverImage,
          gallery: item.gallery,
          status: item.status,
          publishedAt: item.publishedAt,
          featured: item.featured,
          sortOrder: item.sortOrder,
          metaTitle: item.metaTitle,
          metaDesc: item.metaDesc,
          ogImage: item.ogImage,
          authorId: item.authorId,
          deleted: item.deleted,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
        create: {
          id: item.id,
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          body: item.body,
          coverImage: item.coverImage,
          gallery: item.gallery,
          status: item.status,
          publishedAt: item.publishedAt,
          featured: item.featured,
          sortOrder: item.sortOrder,
          metaTitle: item.metaTitle,
          metaDesc: item.metaDesc,
          ogImage: item.ogImage,
          authorId: item.authorId,
          deleted: item.deleted,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
      });
    }

    console.log(`✅ Created ${caseStudies.length} case studies`);

    // ─── Industries ─────────────────────────────────────────────────────
    for (const name of industries) {
      await prisma.industry.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: {
          name,
          slug: slugify(name),
        },
      });
    }

    console.log(`✅ Created ${industries.length} industries`);

    // ─── Tools ──────────────────────────────────────────────────────────
    for (const name of tools) {
      await prisma.tool.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: {
          name,
          slug: slugify(name),
        },
      });
    }

    console.log(`✅ Created ${tools.length} tools`);

    // ─── Technologies ───────────────────────────────────────────────────
    for (const name of technologies) {
      await prisma.technology.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: {
          name,
          slug: slugify(name),
        },
      });
    }

    console.log(`✅ Created ${technologies.length} technologies`);
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
