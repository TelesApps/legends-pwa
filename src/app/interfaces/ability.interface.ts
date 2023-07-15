import { Image } from "./airtable-data.interface";

export interface Ability {
    airtable_id: string;
    effect: string;
    execution_cost: string[];
    level: number;
    points_req: number;
    prereq: string[];
    tags: string[];
    isFoundation: boolean;
    title: string;
    turn_units_req: string;
    image?: Image[];
    description: string;
}