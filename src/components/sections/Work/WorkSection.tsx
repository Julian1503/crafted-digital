import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toProjectProps } from "@/lib/mappers/case-study.mapper";
import { Work } from "@/components/sections/Work/Work";
import { PROJECTS as FALLBACK_PROJECTS } from "@/components/sections/Work/work-data";

export async function WorkSection() {
    let projects;
    try {
        const studies = await getPublishedCaseStudies();
        projects = studies.length > 0 ? studies.map(toProjectProps) : FALLBACK_PROJECTS;
    } catch {
        projects = FALLBACK_PROJECTS;
    }

    return <Work projects={projects} />;
}
