'server-only'
import { SchemaItem } from 'shared_SmileBaby/dist/contract/item.contract'
import { IItem } from 'shared_SmileBaby/dist/types/item.types'

export const nextGetAllItems = async (): Promise<IItem[]> => {
    const entries = await fetch(`${process.env['API_URL']!}/item/getAll`, {
        method: 'GET',
        next: {
            revalidate: 60,
        },
    })

    const data = await entries.json()

    return SchemaItem.array().parse(data)
}
