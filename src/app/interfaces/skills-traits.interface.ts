import { Image } from "./airtable-data.interface";

export interface SkillTraits {
    cost: number;
    title: string;
    airtable_id: string;
    type: string;
    tags: string[];
    effects: string[];
    description?: string;
    prereq: string[];
    image?: Image[];
    conditions?: string[];
}