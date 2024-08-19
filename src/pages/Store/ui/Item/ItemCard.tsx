import Link from 'next/link';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { Slider } from './Slider';

interface IPropsItemCard {
    item: IItem;
}

export const ItemCard: FC<IPropsItemCard> = (props) => {
    const { item } = props;
    return (
        <Link href={`/product/${item.id}`} className='group flex flex-col '>
            <Slider item={item} />
            <span className='mt-[14px] text-[18px] font-bold'>{item.price} ₽</span>
            <span className='mt-[14px]  text-[16px] font-light'>{item.name}</span>
            <span className='text-[14px] font-light text-[#888888] hidden  group-hover:block'>
                Размеры:{' '}
                {item.amount
                    .map((amount) => {
                        return amount.size;
                    })
                    .join(', ')}
            </span>
        </Link>
    );
};
