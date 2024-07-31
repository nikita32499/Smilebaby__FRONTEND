'use client'
import { useFilterItem } from 'entities/item'
import { useImmerState } from 'shared/hook/useImmerState'
import { IEntriesSection } from 'shared_SmileBaby/dist/types/entries.types'
import { IItem } from 'shared_SmileBaby/dist/types/item.types'
import { Filter } from '../Filter/Filter'
import { ItemList } from '../ItemList/ItemList'
interface IPropsStore {
    items: IItem[]
    sections: IEntriesSection[]
    sectionSlug: string
}

interface IStateStore extends Pick<IPropsStore, "sections" | "items"> { }




export const Store: FC<IPropsStore> = (props) => {
    const { sectionSlug } = props
    const [state, setState] = useImmerState<IStateStore>({
        items: props.items,
        sections: props.sections,
    })






    const currentSection = state.sections.find((section) => section.data.slug = sectionSlug)


    const filteredItem = useFilterItem(state.items, currentSection)


    return (
        <div>
            <h1 className='w-[500px]'>{currentSection?.value ?? "Все товары"}</h1>
            <div>
                <Filter />
                <ItemList items={filteredItem} />
            </div>
        </div>
    )
}
