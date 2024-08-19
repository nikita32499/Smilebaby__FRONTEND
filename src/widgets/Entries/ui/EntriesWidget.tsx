'server-only';

import { nextGetAllEntries } from 'entities/entries';
import Link from 'next/link';
import { mapSECTION } from 'shared/helpers/entries';
import { IEntriesSection } from 'shared_SmileBaby/dist/types/entries.types';

export const EntriesWidget = async () => {
    const entries = await nextGetAllEntries();

    return (
        <div className='flex    gap-[24px] items-center justify-center'>
            <a className='flex flex-col items-center'>
                <img
                    src={'/asserts/svg/SmileBaby.svg'}
                    className='rounded-[100px] w-[80px] h-[80px] bg-[#D9D9D9] '
                />
                <span className='mt-[18px] font-bold'>Все товары</span>
            </a>
            {mapSECTION(entries).map((entry) => (
                <EntryElement entry={entry} />
            ))}
        </div>
    );
};

interface IPropsEntry {
    entry: IEntriesSection;
}

const EntryElement: FC<IPropsEntry> = (props) => {
    const { entry } = props;

    return (
        <Link href={`/store/${entry.data.slug}`} className='flex flex-col items-center'>
            <img
                src={entry.data.img}
                className='rounded-[100px] w-[80px] h-[80px] bg-[#D9D9D9]'
            />
            <span className='mt-[18px]'>{entry.value}</span>
        </Link>
    );
};
