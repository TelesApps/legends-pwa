import { DmgType, Image, ItemType } from "./airtable-data.interface";

export interface Item {
    item_type: ItemType;
    cost: number;
    title: string;
    components?: string[];
    dmg_type?: DmgType[];
    weight: number;
    effects: string[];
    crafting_requirements?: string[];
    tags: string[];
    airtable_id: string;
    description?: string;
    body_property?: string;
    armor?: number;
    image?: Image[];
}

export interface ItemSelection {
    currentlyEquipped: Item,
    bodyProperty: string,
    hand?: undefined | 'main-hand' | 'off-hand' | 'backpack',
    isStartingItem: boolean,
    onSelectedItem: Item
  }

