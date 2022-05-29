export interface AirTableData {
    records: Record[];
}

export interface Record {
    id: string;
    createdTime: string;
    fields: Fields;
}

export interface Fields {
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

export enum DmgType {
    Blunt = "Blunt",
    Pierce = "Pierce",
    Slash = "Slash",
}

export enum ItemType {
    Weapon = "Weapon",
    Equipment = "Equipment"
}
