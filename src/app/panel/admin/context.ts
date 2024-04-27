import { createContext } from 'react';

import { IUser } from '@/types/user.types';
import { IViewUnion } from '@/types/view.types';

export interface IStateAdminPanel {
    data: {
        users: IUser[];
        views: IViewUnion[];
    };
    action: {
        name?: string;
        id?: string | number | undefined;
    };

    components: {
        users: () => JSX.Element | '';
        views: () => JSX.Element | '';
    };

    errors: {
        users?: string;
        views?: string;
    };
}

export type TypeSetComponent = Partial<IStateAdminPanel['components']>;

export type TypeSetErrors = Partial<IStateAdminPanel['errors']>;

export interface IContextAdminPanel {
    state: IStateAdminPanel;
    setState: React.Dispatch<React.SetStateAction<IStateAdminPanel>>;
    requestListUsers: () => void;
    requestListViews: () => void;
    setComponent: (Component: TypeSetComponent) => void;
    setError: (errors: TypeSetErrors) => void;
    isActive: (name: string, id?: string | number) => boolean;
    setAction: (name: string | null, id?: string | number) => void;
}

export const Context = createContext<IContextAdminPanel>(null!);
