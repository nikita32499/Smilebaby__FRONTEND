'use client';

import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { SidePanel } from './SidePanel';
import { Slider } from './Slider';

interface IPropsProductClient {
    item: IItem;
}

export const ProductClient: FC<IPropsProductClient> = (props) => {
    const { item } = props;
    return (
        <div className='grid grid-cols-2 grid-rows-2-max'>
            <Slider item={item} />
            <SidePanel item={item} />
        </div>
    );
};
