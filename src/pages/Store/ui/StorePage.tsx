

import { nextGetAllEntries } from 'entities/entries'
import { nextGetAllItems } from 'entities/item'
import { mapSECTION } from 'shared/helpers/entries'
import { EntriesWidget } from 'widgets/Entries'
import { Store } from './Store/Store'



interface IPropsStorePage {
    params: {
        sectionSlug: string
    }
}

export const StorePage: FC<IPropsStorePage> = async (props) => {
    const { params } = props
    const items = await nextGetAllItems()
    const sections = mapSECTION(await nextGetAllEntries())

    return <>
        <EntriesWidget />
        <Store {...{ sectionSlug: params.sectionSlug, items, sections }} />
    </>
}
