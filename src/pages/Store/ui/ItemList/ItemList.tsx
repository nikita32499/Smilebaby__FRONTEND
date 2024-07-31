'use client'
import { IItem } from 'shared_SmileBaby/dist/types/item.types'

interface IPropsItemList {
    items: IItem[]
}

export const ItemList: FC<IPropsItemList> = (props) => {
    const { items } = props
    return (
        <div>
            {items.map((item) => {
                return <div>{item.name}</div>
            })}
        </div>
    )
}
