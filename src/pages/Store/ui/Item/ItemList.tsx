'use client';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { ItemCard } from './ItemCard';

interface IPropsItemList {
    items: IItem[];
}

export const ItemList: FC<IPropsItemList> = (props) => {
    const { items } = props;
    return (
        <div className='grid grid-cols-5 gap-[10px]'>
            {items.map((item, index) => {
                return <ItemCard item={item} key={index} />;
            })}
        </div>
    );
};
