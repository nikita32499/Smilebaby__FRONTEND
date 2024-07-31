'use server';

import { EnumViewNames, IViewUnion } from 'shared_SmileBaby/dist/types/view-custom.types';

export const getViewData = async (nameView: EnumViewNames): Promise<IViewUnion> => {
    const response = await fetch(`${process.env['API_URL']}/view/getView/${nameView}`, {
        next: { revalidate: 30 },
        method: 'GET',
        headers: {
            'Cache-Control': 'no-store',
        },
    });
    let data;
    try {
        data = await response.json();
    } catch (error) {}
    if (!response.status.toString().startsWith('2')) {
        throw new Error(`Failed to fetch ViewData:${nameView}`);
    }
    return data;
};
