import { EntriesWidget } from 'widgets/Entries';
import { HeaderWidget } from 'widgets/Header';

export const HomePage = () => {
    return (
        <div>
            <HeaderWidget />
            <div className='mt-[38px]'>
                <EntriesWidget />
            </div>
        </div>
    );
};
