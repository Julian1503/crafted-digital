import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toProjectProps } from "@/lib/mappers/case-study.mapper";
import { Work } from "@/components/sections/Work/Work";
import {Project} from "@/components/sections/Work/work.types";

export async function WorkSection() {
    let projects;
    try {
        const studies = await getPublishedCaseStudies();
        projects = studies.length > 0 ? studies.map(toProjectProps) : [] as Project[];
    } catch {
        projects = [] as Project[];
    }

    return <Work projects={projects} />;
}
