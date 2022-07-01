import { Image } from "./airtable-data.interface";

export interface SkillTraits {
    cost: number;
    title: string;
    airtable_id: string;
    tags: string[];
    effects: string[];
    description?: string;
    image?: Image[];
}