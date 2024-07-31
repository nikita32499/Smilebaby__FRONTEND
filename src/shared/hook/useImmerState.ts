import { Draft, produce } from 'immer';
import { useState } from 'react';

type ImmerUpdater<T> = (draft: Draft<T>) => void;

export const useImmerState = <T>(
    initialValue: T,
): [T, (updater: ImmerUpdater<T>) => void, () => void] => {
    const [state, setState] = useState(initialValue);

    const updateState = (updater: ImmerUpdater<T>) => {
        setState(produce(updater));
    };

    const resetState = () => {
        setState(initialValue);
    };

    return [state, updateState, resetState];
};
