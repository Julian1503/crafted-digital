import * as react from "react";
import {LucideProps} from "lucide-react";

export type Service = {
    title: string;
    description: string;
    outcome: string;
    bullets: string[];
    icon: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
}