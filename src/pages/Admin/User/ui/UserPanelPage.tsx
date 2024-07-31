'use client';

// import { deleteUsers } from 'api/users.api';

import { isNotBrowser } from 'shared/helpers/isNotBrowser';
import { useImmerState } from 'shared/hook/useImmerState';
import { ViewProvider } from 'shared/ui/ViewProvider/ViewProvider';
import { CreateUser } from './CreateUser/CreateUser';
import { UserList } from './UserList/UserList';
// import { ItemsApi } from 'store/api/users.api';
//

// interface IStateUserPanel {
//   view: {
//     users_create?: TViewsState;
//     users_delete?: TViewsState;
//   };

//   errors: {
//     users: string | null;
//   };
// }

interface IStateUserPanel {
    action: 'list' | 'create';
}

const initialState = (): IStateUserPanel => ({
    action: 'list',
});

export const UserPanelPage = () => {
    if (isNotBrowser()) return;

    const [state, setState, resetState] = useImmerState<IStateUserPanel>(initialState());

    return (
        <ViewProvider>
            {state.action === 'list' ? (
                <UserList
                    flow={{
                        goCreate: () =>
                            setState((prev) => {
                                prev.action = 'create';
                            }),
                    }}
                />
            ) : state.action === 'create' ? (
                <CreateUser
                    flow={{
                        goBack: resetState,
                    }}
                />
            ) : null}
        </ViewProvider>
    );
};
