import {
    EnumEntries,
    IEntriesBase,
    IEntriesSection,
    IEntriesUnion,
} from 'shared_SmileBaby/dist/types/entries.types';

export function isIEntriesSection(entry: IEntriesUnion): entry is IEntriesSection {
    return entry.name === EnumEntries.SECTION;
}

export const mapSECTION = (entries: IEntriesUnion[]): IEntriesSection[] => {
    const result = entries.filter(isIEntriesSection);
    return result;
};

export const mapCOUNTRY = (entries: readonly IEntriesBase[]) => {
    return entries.filter((entry) => entry.name === EnumEntries.COUNTRY);
};
