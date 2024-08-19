'use client';
import { store } from 'app/_providers/store';
import { ItemApi, useFilterItem } from 'entities/item';
import { useLayoutEffect } from 'react';
import { useImmerState } from 'shared/hook/useImmerState';
import { IEntriesSection } from 'shared_SmileBaby/dist/types/entries.types';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { Filter } from '../Filter/Filter';
import { ItemList } from '../Item/ItemList';
interface IPropsStore {
    items: IItem[];
    sections: IEntriesSection[];
    sectionSlug: string;
}

interface IStateStore extends Pick<IPropsStore, 'sections'> {}

export const StoreClient: FC<IPropsStore> = (props) => {
    const { sectionSlug } = props;
    const [state, setState] = useImmerState<IStateStore>({
        sections: props.sections,
    });

    useLayoutEffect(() => {
        store.dispatch(
            ItemApi.util.updateQueryData('getAll', undefined, () => props.items),
        );
    }, []);
    const { data: items = props.items } = ItemApi.useGetAllQuery();

    const currentSection = state.sections.find(
        (section) => (section.data.slug = sectionSlug),
    );

    const filteredItem = useFilterItem(items, currentSection);

    return (
        <div className='mt-[24px]'>
            <h1 className='text-black text-[28px] font-extrabold '>
                {currentSection?.value ?? 'Все товары'}
            </h1>
            <div>
                <Filter items={props.items} />
                <div className='mt-[15px]'>
                    <ItemList items={filteredItem} />
                </div>
            </div>
        </div>
    );
};
