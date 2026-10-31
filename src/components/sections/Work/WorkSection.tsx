import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toProjectProps } from "@/lib/mappers/case-study.mappers";
import { Work } from "@/components/sections/Work/Work";
import {Project} from "@/components/sections/Work/work.types";

export async function WorkSection() {
    // No try/catch on purpose: a DB failure must surface (and let ISR keep the
    // last good page) rather than publish an empty Work section.
    const studies = await getPublishedCaseStudies();
    const projects: Project[] = studies.map(toProjectProps);
    return <Work projects={projects} />;
}
