import { config } from "dotenv";
// .env.local (local Docker database) wins over .env, like Next.js.
config({ path: [".env.local", ".env"], quiet: true });
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { MediaProvider } from "@/generated/prisma/enums";
import { applyCaseStudyRefresh } from "@/lib/db/content/case-study-refresh";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

function generateSlug(value: string): string {
  return value
      .toLowerCase()
      .trim()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
}

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
    id: "cmlsx1gs60001k8vjg4d83ovg",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771472587/crafted-digital/file_oblfuh.jpg",
    filename: "julian.jpg",
    mimeType: "image/jpeg",
    size: 1118320,
    width: 1971,
    height: 1971,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_oblfuh",
    providerPath: "crafted-digital",
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771472587/crafted-digital/file_oblfuh.jpg",
    createdBy: null,
    deleted: true,
    createdAt: new Date("2026-02-19T03:43:07.830+00:00"),
    updatedAt: new Date("2026-02-19T03:52:36.704+00:00"),
  },
  {
    id: "cmlsx3s1h0003k8vjs8763b7m",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771472695/crafted-digital/file_ckb3ex.jpg",
    filename: "julian.jpg",
    mimeType: "image/jpeg",
    size: 1118320,
    width: 1971,
    height: 1971,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_ckb3ex",
    providerPath: "crafted-digital",
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771472695/crafted-digital/file_ckb3ex.jpg",
    createdBy: null,
    deleted: true,
    createdAt: new Date("2026-02-19T03:44:55.733+00:00"),
    updatedAt: new Date("2026-02-19T03:52:39.231+00:00"),
  },
  {
    id: "cmlsxe0nj00024kvj5bytf0pt",
    url: "https://ik.imagekit.io/wengqpwns/crafted-digital/Lourdes-portrait_ep1EAvbLx.jpg",
    filename: "Lourdes-portrait.jpg",
    mimeType: "image/jpeg",
    size: 615577,
    width: 992,
    height: 1276,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.imagekit,
    providerFileId: "699689155c7cd75eb8c59c88",
    providerPath: "/crafted-digital/Lourdes-portrait_ep1EAvbLx.jpg",
    thumbnailUrl:
        "https://ik.imagekit.io/wengqpwns/tr:n-ik_ml_thumbnail/crafted-digital/Lourdes-portrait_ep1EAvbLx.jpg",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: true,
    createdAt: new Date("2026-02-19T03:52:53.455+00:00"),
    updatedAt: new Date("2026-02-19T03:53:51.228+00:00"),
  },
  {
    id: "cmlvr9ten0000ksvjtm4dr1ug",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771644297/crafted-digital/file_ly0yv5.jpg",
    filename: "julian.jpg",
    mimeType: "image/jpeg",
    size: 1118320,
    width: 1971,
    height: 1971,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_ly0yv5",
    providerPath: "crafted-digital",
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771644297/crafted-digital/file_ly0yv5.jpg",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: true,
    createdAt: new Date("2026-02-21T03:24:58.271+00:00"),
    updatedAt: new Date("2026-03-07T11:01:28.390+00:00"),
  },
  {
    id: "cmlvracd40002ksvjzexkanmz",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771644322/crafted-digital/file_qcquut.jpg",
    filename: "Lourdes-portrait.jpg",
    mimeType: "image/jpeg",
    size: 615577,
    width: 992,
    height: 1276,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_qcquut",
    providerPath: "crafted-digital",
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1771644322/crafted-digital/file_qcquut.jpg",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: true,
    createdAt: new Date("2026-02-21T03:25:22.840+00:00"),
    updatedAt: new Date("2026-03-07T11:01:23.624+00:00"),
  },
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
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532349/crafted-digital/file_oagrmb.png",
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
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532526/crafted-digital/file_ojznvr.png",
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
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532529/crafted-digital/file_vqahq7.png",
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
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772776596/crafted-digital/file_j41kfr.jpg",
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
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772778045/crafted-digital/file_phctvf.png",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-06T06:20:46.446+00:00"),
    updatedAt: new Date("2026-03-06T06:20:46.446+00:00"),
  },
  {
    id: "cmmg452pc0000m4vj3u8bc1km",
    url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772875235/crafted-digital/file_zmrafh.jpg",
    filename: "brooke-balentine-odSTxnXyMYY-unsplash.jpg",
    mimeType: "image/jpeg",
    size: 1048847,
    width: 1920,
    height: 2879,
    alt: null,
    title: null,
    tags: null,
    folder: "crafted-digital",
    provider: MediaProvider.cloudinary,
    providerFileId: "crafted-digital/file_zmrafh",
    providerPath: "crafted-digital",
    thumbnailUrl:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772875235/crafted-digital/file_zmrafh.jpg",
    createdBy: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-07T09:20:35.567+00:00"),
    updatedAt: new Date("2026-03-07T09:20:35.567+00:00"),
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
    gallery:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532349/crafted-digital/file_oagrmb.png, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532526/crafted-digital/file_ojznvr.png, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772532529/crafted-digital/file_vqahq7.png, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772875235/crafted-digital/file_zmrafh.jpg, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772778045/crafted-digital/file_phctvf.png, https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772776596/crafted-digital/file_j41kfr.jpg",
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
    updatedAt: new Date("2026-03-08T21:26:29.939+00:00"),
  },
  {
    id: "cmmeieu1v0005oovjaok9r6gt",
    title: "Architect Portfolio Website",
    slug: "architect-portfolio-website",
    summary:
        "A refined portfolio website designed for an architect to showcase selected projects through clean layouts, strong visual storytelling, and a premium editorial feel.",
    body: `{
  "challenge": "The architect needed a digital portfolio that felt as considered and refined as the work itself. The goal was not just to display projects, but to communicate a clear design identity, build credibility with potential clients and collaborators, and create a more elevated online presence than a standard template-based portfolio. The challenge was to balance minimalism with richness: keeping the interface clean and restrained while still giving each project enough visual weight and narrative context to feel memorable.",
  "category": "Architecture",
  "approach": [
    "I approached the project as an extension of the architect's design language rather than a generic website build. That meant focusing on composition, rhythm, typography, whitespace, and image presentation with the same level of care that would go into an architectural portfolio or publication.",
    "Instead of overloading the site with text or interface elements, I prioritised visual storytelling and clarity. The structure was designed to let selected projects stand out while giving the overall experience a calm, premium, and editorial feel.",
    "Every layout decision was made to support both perception and usability, ensuring the site felt distinctive and design-led while remaining intuitive for visitors exploring the work."
  ],
  "solution": "I designed and developed a refined portfolio website centred on strong visual hierarchy, immersive project imagery, and a minimalist interface that reflects the architect's professional identity. The site was structured to showcase selected work through clean project pages, carefully balanced typography, and a consistent editorial rhythm that gives the content space to breathe. I also ensured the experience worked seamlessly across devices, allowing the portfolio to function as both a presentation tool and a professional touchpoint for new opportunities. The final result was a digital presence that feels polished, intentional, and aligned with the quality of the architectural work being presented.",
  "results": [
    "A more distinctive and professional online presence aligned with the architect's design sensibility",
    "Stronger visual storytelling through cleaner layouts and more intentional project presentation",
    "Improved credibility with potential clients, studios, and collaborators",
    "A responsive portfolio experience that performs well across desktop and mobile",
    "A scalable foundation for adding future projects while maintaining a consistent visual standard"
  ],
  "technologies": [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Responsive Web Design",
    "UX/UI Design",
    "Editorial Layout Design"
  ],
  "testimonial": {
    "quote": "The website feels like a true extension of my work. It presents the projects with clarity and elegance, and gives my portfolio a much stronger professional presence.",
    "author": "Lourdes Ynigo",
    "role": "Architecture graduate"
  }
}`,
    coverImage:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772778045/crafted-digital/file_phctvf.png",
    gallery: null,
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
    updatedAt: new Date("2026-03-07T11:01:14.709+00:00"),
  },
  {
    id: "cmmg48jax0002m4vjsxhlzxul",
    title: "The Better Day Support Platform",
    slug: "the-better-day-support-platform",
    summary:
        "Designed and developed a calm, accessible digital platform for The Better Day to better present its support services, strengthen trust with participants and families, and simplify enquiries through a clearer, more human online experience.",
    body: `{
  "challenge": "The Better Day needed a digital presence that felt trustworthy, calm, and professional while clearly communicating its support services to participants, families, and coordinators. Their existing online presence did not fully reflect the warmth of the brand or the quality of care they provided. Key information was difficult to navigate, the messaging lacked clarity for different audience types, and the enquiry journey was not structured in a way that encouraged confidence or action.",
  "category": "Healthcare",
  "approach": [
    "I approached the project by focusing first on trust, clarity, and accessibility. Because The Better Day operates in a people-centred space, the platform needed to feel warm and reassuring without losing professionalism.",
    "Rather than treating it as just a visual redesign, I looked at the full user journey: how a parent, participant, or support coordinator would land on the site, understand the service offering, and decide whether to make contact.",
    "The goal was to create a digital experience that balanced emotional connection with practical clarity, helping the organisation communicate its values while improving usability."
  ],
  "solution": "I designed and developed a modern website experience tailored to The Better Day's identity, using a clean layout, gentle visual language, and structured service pages that made the offering easier to understand. I refined the content hierarchy so visitors could quickly grasp who the organisation helps, what services are available, and how to take the next step. I also improved the enquiry flow to make contacting the team feel simple and approachable. Throughout the project, I prioritised responsive design, accessibility, and a tone of voice that matched the supportive nature of the brand, resulting in a platform that feels both credible and human.",
  "results": [
    "Clearer communication of services for participants, families, and support coordinators",
    "Stronger digital brand presence aligned with The Better Day's values of care, trust, and community",
    "Improved user journey with clearer calls to action and easier navigation",
    "More professional and accessible online experience across desktop and mobile",
    "A scalable foundation for future growth, service expansion, and content updates"
  ],
  "technologies": [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Responsive Web Design",
    "UX/UI Design",
    "Accessibility"
  ],
  "testimonial": {
    "quote": "The new platform feels much more like us. It communicates our services clearly, looks professional, and gives people a much better first impression of who we are and how we support them.",
    "author": "Zoe Thomas",
    "role": "Provider Manager"
  }
}`,
    coverImage:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772875235/crafted-digital/file_zmrafh.jpg",
    gallery: null,
    status: "published",
    publishedAt: new Date("2026-03-01T00:00:00.000+00:00"),
    featured: true,
    sortOrder: 1937,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-03-07T09:23:17.045+00:00"),
    updatedAt: new Date("2026-03-07T09:46:56.050+00:00"),
  },
  {
    id: "cmok1wrccstudio00001a4l01",
    title: "A content studio that turns a college's course catalogue into social posts",
    slug: "wrcc-social-media-content-studio",
    summary:
        "For Western Riverina Community College, with Rapid Ai4 Learning: an internal tool that drafts Facebook, Instagram and LinkedIn posts from real course data, routes them through approval, and publishes from one screen.",
    body: `{
  "version": 2,
  "client": "Western Riverina Community College, with Rapid Ai4 Learning",
  "category": "Education",
  "problem": {
    "headline": "Every course post was written by hand, from memory, three times over.",
    "detail": "Western Riverina Community College runs dozens of courses across two campuses in Griffith and Leeton. Promoting them meant a staff member opening the website, copying the course name, price and dates, and writing a separate post for Facebook, Instagram and LinkedIn. Details drifted out of date, posts went out without a second pair of eyes, and the whole job competed with the actual work of running a college. Rapid Ai4 Learning, who work with the college, brought me in to build the tool."
  },
  "approach": [
    {
      "title": "Ground every post in the real catalogue",
      "body": "A polite scraper crawls the college website on a schedule and stages a diff instead of writing to the live catalogue. New courses, changed prices, new dates and removals are shown before and after, and a person approves or unticks each change. Nothing is ever deleted; a course that disappears upstream is hidden and comes back if the website lists it again."
    },
    {
      "title": "Three angles per platform, in that platform's voice",
      "body": "Pick a course or write a free topic, choose the networks, and the app returns three ideas per platform: direct, story-led and question-led, each adapted to that network's tone, length and format. Every variant can be edited, duplicated, regenerated or archived. The model provider sits behind one interface, so switching between Gemini and OpenAI is configuration."
    },
    {
      "title": "Approval before anything goes live",
      "body": "Posts move from draft to pending approval to approved or rejected to published, and every transition lands in an audit log. Images come from a shared media library per generation, either generated from editable prompts or uploaded by hand, and each post picks which images it sends and in what order."
    },
    {
      "title": "Publish from inside the app",
      "body": "Facebook Page, Instagram Business and LinkedIn Company Page accounts connect once through OAuth, with tokens encrypted at rest. The publish dialog renders the post in that network's own chrome, with character and hashtag counts, before it is sent."
    }
  ],
  "solution": {
    "headline": "One screen from course data to published post, with a person in the middle.",
    "body": "I designed and built the full product: a Next.js front end in the college's branding, a FastAPI back end on PostgreSQL, the catalogue scraper, the provider-agnostic LLM client and the social publishing integrations. Login uses argon2 password hashing and a JWT in an httpOnly cookie. The test suite covers 500 backend tests, 160 frontend tests and Playwright end-to-end runs, with accessibility and visual-regression guards so the branded UI does not drift."
  },
  "results": [
    {
      "type": "metric",
      "metric": "3",
      "label": "platforms published from one tool: Facebook, Instagram and LinkedIn"
    },
    {
      "type": "metric",
      "metric": "3",
      "label": "post angles per platform, grounded in live course name, code, price and dates"
    },
    {
      "type": "metric",
      "metric": "660+",
      "label": "automated tests behind the product, plus Playwright end to end"
    },
    {
      "type": "text",
      "body": "Catalogue changes are reviewed as a diff and approved by a person, so the website stays the single source of truth."
    },
    {
      "type": "text",
      "body": "Every status change is written to an audit log, which is what a registered training organisation needs when someone asks who approved what."
    }
  ],
  "stack": [
    "Next.js 14",
    "React 18",
    "TypeScript",
    "FastAPI",
    "PostgreSQL",
    "SQLAlchemy",
    "Gemini / OpenAI",
    "Playwright",
    "pytest",
    "Vitest"
  ]
}`,
    coverImage:
        "/img/projects/wrcc-social-media-marketing/01-generate-post-ideas.png",
    gallery: "/img/projects/wrcc-social-media-marketing/01-generate-post-ideas.png, /img/projects/wrcc-social-media-marketing/02-post-media-library.png, /img/projects/wrcc-social-media-marketing/03-history-approval-workflow.png, /img/projects/wrcc-social-media-marketing/04-publish-preview.png, /img/projects/wrcc-social-media-marketing/05-catalog-review-changeset.png",
    status: "published",
    publishedAt: new Date("2026-09-01T00:00:00.000+00:00"),
    featured: true,
    sortOrder: 1200,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-10-30T00:00:00.000+00:00"),
    updatedAt: new Date("2026-10-30T00:00:00.000+00:00"),
  },
  {
    id: "cmok1ai4lcrm0000000001a4l02",
    title: "A CRM that sends nothing without consent and a human approval",
    slug: "ai4l-crm-consent-safe-campaigns",
    summary:
        "A private CRM and marketing workspace for Rapid Ai4 Learning: contacts, segments and email campaigns where the approval rules live in the database, and Claude drafts the copy but can never send it.",
    body: `{
  "version": 2,
  "client": "Rapid Ai4 Learning",
  "category": "Education",
  "problem": {
    "headline": "Client data lived in spreadsheets, and every campaign was a manual risk.",
    "detail": "Rapid Ai4 Learning is a small training business with leads, customers, newsletter subscribers and course enquiries arriving from several places. Lists were exported and re-imported by hand, consent for newsletters and consent for course offers were not tracked separately, and sending a campaign depended on someone remembering who had unsubscribed. A generic CRM would have added fields and dashboards without solving the actual problem, which was control over what goes out and to whom."
  },
  "approach": [
    {
      "title": "Contacts as the single source of truth",
      "body": "One database for customers, prospects, subscribers and course consents, searchable by job type, state, tags, organisation and industry. Status and subscription state are colour-coded so the difference between a customer and an unsubscribed contact is visible without opening anything. Contacts are never hard-deleted; removal is an archive with history."
    },
    {
      "title": "Segments that cannot include the wrong people",
      "body": "Audiences are built from tags, state, job type, status, service or organisation, with a live count before saving. A segment always excludes archived contacts and anyone who has not consented to the kind of email being sent. Newsletters and course offers are separate consent streams."
    },
    {
      "title": "Approval enforced by Postgres, not by the UI",
      "body": "Campaigns move through draft, in review, approved, sending and sent. The transitions are enforced by database triggers and constraints, so an unapproved campaign cannot be sent even by a buggy client. Claude drafts campaign copy for a segment and the Content Studio turns one brief into Facebook, Instagram and email variants, but nothing the model writes can send itself."
    },
    {
      "title": "The integrations that make it a real workspace",
      "body": "Excel and CSV import with column mapping and a validation summary before anything is committed. Paid-then-scheduled consultations through Stripe Checkout and Calendly with webhook reconciliation. Two-way subscription sync with EmailOctopus, one-click unsubscribe and a preferences page for contacts. Invite-only access with admin and operator roles."
    }
  ],
  "solution": {
    "headline": "Consent-first by design, tested end to end.",
    "body": "Row-level security on every table, an approved-members-only policy, status-transition triggers, consent-version tracking and replay-safe webhook handling, all verified by database test suites. Unit and integration tests in Jest, browser end-to-end and accessibility checks in Playwright across Chromium, Firefox and WebKit, targeting WCAG 2.1 AA. Webhooks are idempotent, provider sync runs through an outbox, and a missing API key shows a clear not-configured state instead of a crash."
  },
  "results": [
    {
      "type": "metric",
      "metric": "5",
      "label": "campaign states, with every transition enforced in the database"
    },
    {
      "type": "metric",
      "metric": "2",
      "label": "separate consent streams: newsletters and course offers"
    },
    {
      "type": "metric",
      "metric": "3",
      "label": "browsers covered by end-to-end and accessibility tests"
    },
    {
      "type": "text",
      "body": "Unsubscribes are honoured immediately and propagated to the email provider in both directions."
    },
    {
      "type": "text",
      "body": "AI writes the first draft of campaigns and social posts; a person approves every variant before it goes anywhere."
    }
  ],
  "stack": [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Supabase",
    "PostgreSQL (RLS)",
    "Claude API",
    "EmailOctopus",
    "Stripe",
    "Calendly",
    "Jest",
    "Playwright"
  ]
}`,
    coverImage:
        "/img/projects/CRM-Ai4L/contacts-dashboard.webp",
    gallery: "/img/projects/CRM-Ai4L/contacts-dashboard.webp, /img/projects/CRM-Ai4L/contact-detail.webp, /img/projects/CRM-Ai4L/segments.webp, /img/projects/CRM-Ai4L/campaigns.webp, /img/projects/CRM-Ai4L/content-studio.webp",
    status: "published",
    publishedAt: new Date("2026-07-01T00:00:00.000+00:00"),
    featured: true,
    sortOrder: 1300,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-10-30T00:00:00.000+00:00"),
    updatedAt: new Date("2026-10-30T00:00:00.000+00:00"),
  },
  {
    id: "cmok1scout00000000001a4l03",
    title: "Social Media Scout: an AI agent that drafts replies and a person who approves them",
    slug: "social-media-scout-ai-agent-human-review",
    summary:
        "An agentic system for Rapid Ai4 Learning that watches Facebook community groups, decides which posts are worth answering, drafts a helpful reply and queues it for human review. Dry-run by default, with kill switches and a full audit trail.",
    body: `{
  "version": 2,
  "client": "Rapid Ai4 Learning",
  "category": "AI Automation",
  "problem": {
    "headline": "The best leads were questions in community groups that nobody had time to read.",
    "detail": "People ask for course recommendations in local Facebook groups every day. Answering them well is slow: read the group, judge whether the post is a real request, check the group's rules on business mentions, write something useful, and remember to follow up. Rapid Ai4 Learning wanted that done consistently, without spamming groups and without a bot pretending to be a local. The brief was an assistant that finds the right posts and drafts the reply, and a person who decides."
  },
  "approach": [
    {
      "title": "Classify first, write later",
      "body": "Playwright scrapes the configured groups on a staggered schedule. Claude scores each post for relevance and intent (course request, recommendation request, discussion, off-topic) and writes down its reason. Skipped posts keep the exact skip reason, such as below threshold or group prohibits business mentions, so every decision is explainable."
    },
    {
      "title": "A policy engine that reads the rules before a word is written",
      "body": "Each group's rules are interpreted by the model and overridable by a human. Rate limits, no-promotion groups, admin-approval groups and kill switches are enforced at the config, policy and poster layers independently. A reply is drafted only when the post explicitly asks for something the business really offers, and it is always transparent about who is answering."
    },
    {
      "title": "The review queue is the product",
      "body": "Each row pairs the original post with the suggested comment and the group it came from. A person approves, edits or skips. Nothing reaches Facebook without passing here unless a group is explicitly configured otherwise. After posting, the system checks whether the comment survived moderation, tracks replies and can draft follow-ups."
    },
    {
      "title": "Built to be switched off",
      "body": "Dry-run is the default and real posting needs an explicit flag; the live command refuses to start otherwise. A circuit breaker pauses automation after repeated failures. Groups that remove too many comments are paused or moved to human-only. A mandatory seven-day dry-run precedes going live, and every action is audited."
    }
  ],
  "solution": {
    "headline": "Business-agnostic by design, hexagonal under the hood.",
    "body": "Everything the system knows about the organisation and each group lives in validated YAML with a built-in editor, version history and playground, so the same engine can serve a training provider, a local shop or a non-profit. The core domain (classifier, policy engine, comment generator, pipeline orchestrator) has zero dependency on Facebook; scraper, poster, database and notifications are swappable adapters. Built with strict test-driven development, HTML snapshot tests for the scraper so no live Facebook is needed, and AI outputs asserted on structure and constraints rather than exact text. The admin UI ships with rate-limited login, CSRF protection, signed sessions and a nonce-based content security policy."
  },
  "results": [
    {
      "type": "metric",
      "metric": "7",
      "label": "days of mandatory dry-run before any group goes live"
    },
    {
      "type": "metric",
      "metric": "3",
      "label": "independent layers enforcing rate limits: config, policy and poster"
    },
    {
      "type": "metric",
      "metric": "0",
      "label": "comments posted without a human decision, unless a group is explicitly configured otherwise"
    },
    {
      "type": "text",
      "body": "Every skipped post carries its reason, so the team can audit the agent's judgement instead of trusting a black box."
    },
    {
      "type": "text",
      "body": "The same engine can be pointed at a different business by changing configuration, not code."
    }
  ],
  "stack": [
    "Python",
    "FastAPI",
    "HTMX",
    "Playwright",
    "Anthropic Claude API",
    "SQLAlchemy",
    "PostgreSQL",
    "Pydantic",
    "Docker",
    "Fly.io"
  ]
}`,
    coverImage:
        "/img/projects/social-media-scout/dashboard.webp",
    gallery: "/img/projects/social-media-scout/dashboard.webp, /img/projects/social-media-scout/review-queue.webp, /img/projects/social-media-scout/scraped-posts.webp, /img/projects/social-media-scout/pipeline.webp",
    status: "published",
    publishedAt: new Date("2026-05-01T00:00:00.000+00:00"),
    featured: false,
    sortOrder: 1400,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-10-30T00:00:00.000+00:00"),
    updatedAt: new Date("2026-10-30T00:00:00.000+00:00"),
  },
  {
    id: "cmok1ai4lsite0000000001a4l04",
    title: "Lead-gen tools and a course checkout for a training business",
    slug: "ai4l-lead-gen-tools-and-checkout",
    summary:
        "Features built into Rapid Ai4 Learning's marketing and enrolment site: a scored AI maturity assessment, an ROI calculator that hands sales a number, a multi-course basket with volume pricing and Stripe checkout, and a site-wide AI concierge.",
    body: `{
  "version": 2,
  "client": "Rapid Ai4 Learning",
  "category": "Education",
  "problem": {
    "headline": "The site explained the courses. It did not qualify anyone or take a payment.",
    "detail": "Rapid Ai4 Learning's website did its job as a brochure. Visitors could read about AI training, but there was nothing that turned interest into a conversation the sales team could act on, and enrolling several people in several courses meant emails back and forth. The team wanted tools that give a visitor something useful in return for their details, and a checkout that handles group bookings in one payment."
  },
  "approach": [
    {
      "title": "A six-minute assessment that produces a report, and a lead",
      "body": "Eighteen multiple-choice questions across six pillars: Leadership, Governance, Capability, Adoption, Agentic Maturity and Ways of Working. A scoring engine computes a score per pillar and an overall maturity level, and the results page shows the two weakest pillars as where to focus first, with a call to book a consultation. The report is emailed to the team through a Supabase edge function with validation and a retry state."
    },
    {
      "title": "An ROI calculator that turns a vague idea into a dollar figure",
      "body": "Three steps: Industry, Agents, Calculate. The industry selector preloads realistic benchmarks, the agent picker suggests agents for that sector with per-agent pricing, and the results update as sliders move: projected ROI, net annual gain, payback period, opportunity cost and staff hours saved. A compliance model for RTO and TAFE organisations estimates hours of compliance admin reclaimed. Results go to the team, so sales gets a qualified lead with the numbers attached."
    },
    {
      "title": "A basket that handles group enrolments and volume pricing",
      "body": "A global basket with quantity controls and a seat cap per course. Tiered volume pricing shows the saving and the struck-through price live: four seats on Train the AI Trainer cost AU$2,595 instead of AU$4,780. Checkout creates one Stripe payment through a Supabase function, then enrols and invites the user in Coursebox after payment. Inputs are validated and sanitised before use."
    },
    {
      "title": "A concierge that stays out of the way",
      "body": "The Rachel virtual concierge runs across the whole site, replacing the earlier chatbot. The loader script is injected once and cleaned up on unmount, quick-reply buttons route visitors to flagship programmes, booking and the ROI calculator, and the widget hides itself on the assessment page so it never covers the form."
    }
  ],
  "solution": {
    "headline": "Four features, each with a measurable job.",
    "body": "All of this was built into the existing React, TypeScript and Vite codebase with Tailwind and shadcn/ui, on Supabase and Stripe. Focus management between screens, keyboard-friendly radio groups, per-page SEO metadata and lazy-loaded routes came with the work, along with Calendly links wired through environment variables, Open Graph metadata and a newsletter component."
  },
  "results": [
    {
      "type": "metric",
      "metric": "18",
      "label": "questions across 6 pillars, scored into a maturity level and a focus list"
    },
    {
      "type": "metric",
      "metric": "AU$2,185",
      "label": "saved on a four-seat booking, shown live in the basket"
    },
    {
      "type": "metric",
      "metric": "1",
      "label": "Stripe payment for any number of courses and seats"
    },
    {
      "type": "text",
      "body": "Both lead-gen tools deliver the visitor's answers to the sales team, so follow-up starts from a report rather than a blank form."
    }
  ],
  "stack": [
    "React 18",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "shadcn/ui",
    "Supabase",
    "Stripe",
    "Coursebox",
    "Calendly"
  ]
}`,
    coverImage:
        "/img/projects/ai4l-features/02-strategy-assessment-results.png",
    gallery: "/img/projects/ai4l-features/01-strategy-assessment-questions.png, /img/projects/ai4l-features/02-strategy-assessment-results.png, /img/projects/ai4l-features/03-agentic-roi-calculator.png, /img/projects/ai4l-features/04-basket-volume-pricing.png, /img/projects/ai4l-features/05-ai-chat-concierge.png",
    status: "published",
    publishedAt: new Date("2026-04-01T00:00:00.000+00:00"),
    featured: false,
    sortOrder: 1500,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-10-30T00:00:00.000+00:00"),
    updatedAt: new Date("2026-10-30T00:00:00.000+00:00"),
  },
  {
    id: "cmok1compliance000001a4l05",
    title: "A compliance platform for training organisations, where the model proposes and code verifies",
    slug: "rto-compliance-platform",
    summary:
        "In progress for two community colleges, with Rapid Ai4 Learning: a multi-tenant platform that keeps regulatory texts current from official sources, audits policies against them, and turns the gaps into risks a person manages to closure.",
    body: `{
  "version": 2,
  "client": "Two community colleges in NSW, with Rapid Ai4 Learning",
  "category": "Compliance",
  "problem": {
    "headline": "Checking policies against the regulator by hand is slow, easy to get wrong and never finished.",
    "detail": "A registered training organisation has to show that its policies on trainer qualifications, complaints, assessment, privacy and more comply with a stack of documents: the Standards for RTOs, the Credential Policy, the Privacy Act and regulator guidance. Those texts change, live on different sites, and some regulators block automated access. Two community colleges, working with Rapid Ai4 Learning, needed a way to keep up without hiring for it."
  },
  "approach": [
    {
      "title": "Official text, kept current, never guessed",
      "body": "Regulatory documents are fetched on a schedule from their official sources, such as the Federal Register of Legislation API and the OAIC. A new version is stored only when the wording changes, and every version is kept. Legal status comes only from an authoritative signal, never from a model. Where a regulator blocks automated clients, the block is recorded with evidence and the document can only enter through an authorised upload by a person, clearly marked as such."
    },
    {
      "title": "An obligation library anchored to verbatim quotes",
      "body": "Each obligation is a specific clause with a verbatim anchor quote, written guidance and, where relevant, a closed list such as approved credential codes. An entry is used only if the quote and the clause reference really match the stored official text."
    },
    {
      "title": "The model proposes, code verifies",
      "body": "A client uploads a policy and confirms its category. Code decides which obligations apply and builds a checklist with the official wording; the model assesses the policy against it in one structured call with no tools and no web access. Every claim is then checked: the cited clause exists on the current version and the quote is a contiguous span of the real text, a finding that blames a policy section quotes it verbatim, credential lists are compared by set difference. A claim that fails goes to a person as requires human review, never shown as fact."
    },
    {
      "title": "Gaps become risks with a lifecycle",
      "body": "One risk per policy and obligation, never duplicated across re-scans: candidate, under review, confirmed, in remediation, evidence accepted, closed, with reopen reasons. Ratings are set by a person and a risk cannot close without accepted evidence. When a regulatory text changes, only the affected policies are flagged, and re-scans run through a budgeted queue with the estimated model cost shown first."
    }
  ],
  "solution": {
    "headline": "Multi-tenant, white-label and hosted in Australia.",
    "body": "One subdomain and brand per client, agents switched on per contract, and view-as-client support with an audit log. Tenant isolation is enforced with Postgres row-level security as a second line behind the service layer, with an automated test per route proving one tenant cannot read another's data. Login is invitation-only with Argon2id hashing and server-side sessions. Outbound crawling goes through a single policy-enforcing client: https only, allowlisted hosts, robots.txt respected, a contactable User-Agent and no browser imitation. Retrieval is hybrid (full-text, pgvector semantic search and exact legal-reference matching) with a local reranker so policy text stays on the Sydney server. The design follows a closed proof of concept that measured detection, citation validity and cost before a line of product code was written."
  },
  "results": [
    {
      "type": "metric",
      "metric": "0.94",
      "label": "hit@5 on a hand-labelled retrieval query set in the proof of concept (hit@1 0.87)"
    },
    {
      "type": "metric",
      "metric": "6",
      "label": "delivery phases with measurable exit criteria, each verified in staging"
    },
    {
      "type": "text",
      "body": "Phase 0 (foundations: login, tenancy with row-level security, provider layer, platform console) is in progress. This page will be updated as phases ship."
    }
  ],
  "stack": [
    "Python 3.12",
    "FastAPI",
    "PostgreSQL 16 + pgvector",
    "Redis / RQ",
    "Next.js 16",
    "React 19",
    "Tailwind v4",
    "OpenAI",
    "Perplexity",
    "Docker"
  ]
}`,
    coverImage:
        "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772776596/crafted-digital/file_j41kfr.jpg",
    gallery: null,
    status: "draft",
    publishedAt: new Date("2026-10-01T00:00:00.000+00:00"),
    featured: false,
    sortOrder: 1600,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-10-30T00:00:00.000+00:00"),
    updatedAt: new Date("2026-10-30T00:00:00.000+00:00"),
  },
];

const plans = [
  {
    id: "cmmg9q7al0003xgvjlnb2iqgp",
    name: "Starter Website",
    description:
        "Perfect for small businesses in Toowoomba that need a professional online presence fast, without the cost of a custom platform.",
    price: 2450,
    currency: "AUD",
    interval: "one-time",
    features: `Up to 5 pages
Mobile responsive design
Contact form
Basic SEO setup
Google Maps and social links
1 round of revisions
2 weeks delivery`,
    sortOrder: 1,
    active: true,
    highlighted: false,
    createdAt: new Date("2026-03-07T11:56:59.373+00:00"),
    updatedAt: new Date("2026-03-07T11:56:59.373+00:00"),
  },
  {
    id: "cmmg9roh00005xgvjafiq51l6",
    name: "Growth Website",
    description:
        "A stronger business website for companies that want a more polished brand presence, better conversions, and room to grow.",
    price: 4990,
    currency: "AUD",
    interval: "one-time",
    features: `Up to 10 pages
Custom design system
CMS for editing content
Advanced contact or enquiry forms
On page SEO
Performance optimisation
Basic analytics setup
2 rounds of revisions
4 to 6 weeks delivery`,
    sortOrder: 2,
    active: true,
    highlighted: true,
    createdAt: new Date("2026-03-07T11:58:08.292+00:00"),
    updatedAt: new Date("2026-03-07T11:58:08.292+00:00"),
  },
  {
    id: "cmmg9skhw0007xgvjim1dcnuv",
    name: "Ongoing Tech Partner",
    description:
        "For businesses that need continuous improvements, support, landing pages, automations, and a reliable developer on call each month.",
    price: 990,
    currency: "AUD",
    interval: "monthly",
    features: `Up to 8 hours of development per month
Website updates and bug fixes
Landing page changes
Basic automation support
Priority email support
Monthly review and planning
Unused hours do not roll over`,
    sortOrder: 4,
    active: true,
    highlighted: false,
    createdAt: new Date("2026-03-07T11:58:49.796+00:00"),
    updatedAt: new Date("2026-03-07T11:58:49.796+00:00"),
  },
  {
    id: "cmok1plansoftware0000001",
    name: "Custom Software & AI Automation",
    description:
        "For businesses that have outgrown spreadsheets and copy-paste. A custom quote for internal tools, automations and AI assistants, built to fit how you work.",
    price: 8000,
    currency: "AUD",
    interval: "one-time",
    features: `{
  "tagline": "Internal tools, automations and AI assistants, scoped to how you work.",
  "timeline": "6 to 12 weeks",
  "features": [
    "Discovery workshop and written scope",
    "CRM, portal, dashboard or approval workflow",
    "Integrations: Stripe, email, calendars, your existing tools",
    "AI features with a human approval step",
    "Automated tests and audit trail",
    "Weekly demos",
    "30 days post-launch support"
  ],
  "cta": "Scope my project"
}`,
    sortOrder: 3,
    active: true,
    highlighted: false,
    createdAt: new Date("2026-10-30T00:00:00.000+00:00"),
    updatedAt: new Date("2026-10-30T00:00:00.000+00:00"),
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

function assertSafeToSeed(): void {
  const url = process.env.DATABASE_URL ?? "";
  const host = (() => { try { return new URL(url).hostname; } catch { return ""; } })();
  const isLocal = ["localhost", "127.0.0.1", "::1", ""].includes(host) || host.endsWith(".local");
  if (!isLocal && process.env.ALLOW_PROD_SEED !== "1") {
    throw new Error(
      `Refusing to seed a non-local database (${host}). Set ALLOW_PROD_SEED=1 if you really mean it.`
    );
  }
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "1") {
    throw new Error("Refusing to seed with NODE_ENV=production. Set ALLOW_PROD_SEED=1 to override.");
  }
}

function requireSeedAdminPassword(): string {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be set and at least 12 characters long.");
  }
  return password;
}

async function main() {
  console.log("🌱 Seeding database...");
  assertSafeToSeed();

  // ✅ Admin user FIRST — referenced by mediaAssets and caseStudies via createdBy / authorId.
  // Create-only: an existing admin keeps its password, name and active flag.
  const adminPassword = requireSeedAdminPassword();
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@crafted.dev" },
    update: {},
    create: {
      id: "cmlsxd2f800131svj2wcrlk3r",
      name: "Admin",
      email: "admin@crafted.dev",
      hashedPassword,
      active: true,
    },
  });

  console.log("✅ Created or updated admin user");

  // Media assets
  for (const asset of mediaAssets) {
    await prisma.mediaAsset.upsert({
      where: { id: asset.id },
      update: {}, // create-only: admin edits win
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

  console.log(`✅ Created or updated ${mediaAssets.length} media assets`);

  // Case studies (with the 2026-11-01 content refresh applied on create)
  for (const raw of caseStudies) {
    const item = applyCaseStudyRefresh(raw);
    await prisma.caseStudy.upsert({
      where: { slug: item.slug },
      update: {}, // create-only: admin edits, status changes and deletions win
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

  console.log(`✅ Created or updated ${caseStudies.length} case studies`);

  // Plans
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {}, // create-only: pricing is edited from the admin
      create: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        features: plan.features,
        sortOrder: plan.sortOrder,
        active: plan.active,
        highlighted: plan.highlighted,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      },
    });
  }

  console.log(`✅ Created or updated ${plans.length} plans`);

  // Industries
  for (const name of industries) {
    await prisma.industry.upsert({
      where: { slug: generateSlug(name) },
      update: { name },
      create: {
        name,
        slug: generateSlug(name),
      },
    });
  }

  console.log(`✅ Created or updated ${industries.length} industries`);

  // Tools
  for (const name of tools) {
    await prisma.tool.upsert({
      where: { slug: generateSlug(name) },
      update: { name },
      create: {
        name,
        slug: generateSlug(name),
      },
    });
  }

  console.log(`✅ Created or updated ${tools.length} tools`);

  // Technologies
  for (const name of technologies) {
    await prisma.technology.upsert({
      where: { slug: generateSlug(name) },
      update: { name },
      create: {
        name,
        slug: generateSlug(name),
      },
    });
  }

  console.log(`✅ Created or updated ${technologies.length} technologies`);

  // Permissions
  const permissions: Record<string, string> = {};

  for (const mod of modules) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: { module_action: { module: mod, action } },
        update: {},
        create: { module: mod, action },
      });

      permissions[`${mod}:${action}`] = permission.id;
    }
  }

  console.log(`✅ Created or updated ${Object.keys(permissions).length} permissions`);

  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {
      description: "Full system access",
    },
    create: {
      name: "admin",
      description: "Full system access",
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: "editor" },
    update: {
      description: "Content management access",
    },
    create: {
      name: "editor",
      description: "Content management access",
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: "viewer" },
    update: {
      description: "Read-only access",
    },
    create: {
      name: "viewer",
      description: "Read-only access",
    },
  });

  console.log("✅ Created or updated roles");

  // Role permissions
  for (const permissionId of Object.values(permissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId,
      },
    });
  }

  for (const key of ["content:read", "content:create", "content:update"]) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: editorRole.id,
          permissionId: permissions[key],
        },
      },
      update: {},
      create: {
        roleId: editorRole.id,
        permissionId: permissions[key],
      },
    });
  }

  for (const key of ["content:read"]) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: permissions[key],
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: permissions[key],
      },
    });
  }

  console.log("✅ Assigned permissions to roles");

  // Assign admin role to admin user (roles are now guaranteed to exist)
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Assigned admin role to admin user");

  // Integrations
  const integrations = [
    { name: "stripe", enabled: false, status: "disconnected" },
    { name: "resend", enabled: false, status: "disconnected" },
    { name: "analytics", enabled: false, status: "disconnected" },
  ];

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { name: integration.name },
      update: {}, // create-only: never reset a connected integration
      create: integration,
    });
  }

  console.log("✅ Created or updated integrations");

  // Site settings
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
      update: {}, // create-only: settings are edited from the admin
      create: setting,
    });
  }

  console.log("✅ Created or updated site settings");
  console.log("🎉 Seed complete!");
}

main()
    .catch((error) => {
      console.error("❌ Seed failed");
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });