import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { IPurchase } from '../model/items.slice';

export const findPurchase = (cartList: IPurchase[], targetItem: IItem) => {
    return cartList.find((purchase) => {
        return (
            purchase.item.id === targetItem.id &&
            targetItem.amount.find((amount) => amount.size === purchase.size)
        );
    });
};
