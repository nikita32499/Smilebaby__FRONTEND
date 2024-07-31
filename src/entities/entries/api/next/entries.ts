'server-only'
import { SchemaEntriesUnion } from 'shared_SmileBaby/dist/contract/entries.contract'
import { IEntriesUnion } from 'shared_SmileBaby/dist/types/entries.types'

export const nextGetAllEntries = async (): Promise<IEntriesUnion[]> => {
    const entries = await fetch(`${process.env['API_URL']!}/entries/getAll`, {
        method: 'GET',
        next: {
            revalidate: 60,
        },
    })

    const data = await entries.json()

    return SchemaEntriesUnion.array().parse(data)
}
