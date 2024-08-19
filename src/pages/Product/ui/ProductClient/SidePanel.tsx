import cn from 'classnames';
import { findPurchase } from 'entities/item';
import { useActions, useAppSelector } from 'shared/hook/redux-hooks';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
interface IPropsSidePanel {
    item: IItem;
}

export const SidePanel: FC<IPropsSidePanel> = (props) => {
    const { item } = props;
    const purchaseList = useAppSelector((store) => store.itemsSlice.cart);

    const { addInCart, removeFromCart } = useActions();

    const toggleSizeHandler = (size: string) => {
        const existItem = findPurchase(purchaseList, item);
        if (existItem) {
            removeFromCart({
                item,
                size,
                quantity: 1,
            });
        } else {
            addInCart({
                item,
                size,
                quantity: 1,
            });
        }
    };

    return (
        <div className='flex flex-col'>
            <span className='text-[24px]'>{item.name}</span>
            <span className='text-[#888] text-[16px] mt-[7px]'>{item.section.value}</span>
            <span className='text-[16px] mt-[7px]'>{item.price} ₽</span>

            <div className='mt-[80px]'>
                <span className='texct-[16px]'>Размер</span>
                <div className='grid grid-cols-4 gap-[8px]'>
                    {item.amount.map((amount) => {
                        return (
                            <button
                                className={cn(
                                    'w-[64px] h-[48px] rounded-[4px]',
                                    purchaseList.some(
                                        (purchase) => purchase.size === amount.size,
                                    )
                                        ? 'bg-black text-white border-0'
                                        : 'border-[1px] border-[#E5E5E5]',
                                )}
                                onClick={() => {
                                    toggleSizeHandler(amount.size);
                                }}
                            >
                                {amount.size}
                            </button>
                        );
                    })}
                </div>
            </div>
            <button>Перейти в корзину</button>
        </div>
    );
};
