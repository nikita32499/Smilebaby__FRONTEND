import { nextGetAllEntries } from 'entities/entries';
import { nextGetAllItems } from 'entities/item';
import { mapSECTION } from 'shared/helpers/entries';
import { PageParams } from 'shared/types/params';
import { EntriesWidget } from 'widgets/Entries';
import { StoreClient } from './StoreClient/StoreClient';

interface IPropsStorePage extends PageParams {
    params: {
        sectionSlug: string;
    };
}

export const StorePage: FC<IPropsStorePage> = async (props) => {
    const { params } = props;
    const items = await nextGetAllItems();
    const sections = mapSECTION(await nextGetAllEntries());

    return (
        <>
            <div className='mt-[38px]'>
                <EntriesWidget />
            </div>

            <StoreClient {...{ sectionSlug: params.sectionSlug, items, sections }} />
        </>
    );
};
