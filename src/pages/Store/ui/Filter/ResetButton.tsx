import cn from 'classnames';
import { useActions, useAppSelector } from 'shared/hook/redux-hooks';

export const ResetButton = () => {
    const modified = useAppSelector((store) => store.itemsSlice.filter.modified);
    const { resetFilter } = useActions();
    return (
        <button
            className={cn(
                'h-[35px] px-[9px] w-max rounded-[5px] border-[#E5E5E5] border-[1px] relative bg-black text-white ml-auto',
                modified ? 'block' : 'hidden',
            )}
            onClick={() => {
                resetFilter();
            }}
        >
            Сбросить
        </button>
    );
};
