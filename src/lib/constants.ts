/**
 * @fileoverview Technology stack constants and legacy badge exports.
 * Contains the list of technologies and their icon URLs displayed in the TechStack section.
 *
 * Note: Status badge constants are now centralized in @/lib/types/enums
 * These re-exports maintain backward compatibility.
 */

import {
  CONTENT_STATUS_BADGE,
  LEAD_STATUS_BADGE,
  BOOKING_STATUS_BADGE
} from "@/lib/types/enums";

/**
 * Technology item with name and icon URL.
 */
interface TechItem {
    /** Display name of the technology */
    name: string;
    /** URL to the technology's icon/logo */
    icon: string;
}

/**
 * List of technologies showcased in the tech stack section.
 * Each item includes a display name and CDN-hosted icon URL.
 */
const TECH: TechItem[] = [
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" },
    { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg" },
    { name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Nginx", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
];

export { TECH };
export type { TechItem };

/* ------------------------------------------------------------------ */
/*  Legacy badge exports (for backward compatibility)                 */
/*  Import from @/lib/types/enums in new code                         */
/* ------------------------------------------------------------------ */

/**
 * @deprecated Use CONTENT_STATUS_BADGE from @/lib/types/enums instead
 */
export const STATUS_BADGE = CONTENT_STATUS_BADGE;

/**
 * @deprecated Use LEAD_STATUS_BADGE from @/lib/types/enums instead
 */
export const LEAD_STATUS_COLORS = LEAD_STATUS_BADGE;

/**
 * @deprecated Use BOOKING_STATUS_BADGE from @/lib/types/enums instead
 */
export const BOOKING_STATUS_COLORS = BOOKING_STATUS_BADGE;