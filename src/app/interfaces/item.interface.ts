import { DmgType, ItemType } from "./airtable-data.interface";

export interface Item {
    item_type: ItemType;
    cost: number;
    title: string;
    components?: string[];
    dmg_type?: DmgType[];
    weight: number;
    effects: string[];
    crafting_requierments?: string[];
    tags: string[];
    airtable_id: string;
    description?: string;
    body_property?: string;
    armor?: number;
}
