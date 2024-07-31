import { createContext } from 'react';
import { IViewUnion } from 'shared_SmileBaby/dist/types/view-custom.types';

export interface IPropsChangeViewElement {
    view: IViewUnion;
    flow: {
        goBack: () => void;
    };
    rerender: () => void;
}

const ContextChangeViewElement = createContext<IPropsChangeViewElement>(null!);

export { ContextChangeViewElement };
