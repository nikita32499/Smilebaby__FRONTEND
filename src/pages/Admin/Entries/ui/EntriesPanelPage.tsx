'use client';
import { isNotBrowser } from 'shared/helpers/isNotBrowser';
import { useImmerState } from 'shared/hook/useImmerState';
import { ViewProvider } from 'shared/ui/ViewProvider/ViewProvider';
import { IEntriesUnion } from 'shared_SmileBaby/dist/types/entries.types';
import { CreateUpdateEntries } from './CreateUpdateEntries/CreateUpdateEntries';
import { EntriesList } from './EntriesList/EntriesList';

interface IStateEntriesPanelPage {
    action: 'create' | null;
    updateEntry: IEntriesUnion | null;
}

const initialState = (): IStateEntriesPanelPage => ({ updateEntry: null, action: null });

export const EntriesPanelPage: FC = () => {
    if (isNotBrowser()) return null;

    const [state, setState, resetState] =
        useImmerState<IStateEntriesPanelPage>(initialState());

    return (
        <ViewProvider>
            {state.updateEntry ? (
                <CreateUpdateEntries
                    updateEntry={state.updateEntry}
                    flow={{
                        goBack: resetState,
                    }}
                />
            ) : state.action === 'create' ? (
                <CreateUpdateEntries
                    flow={{
                        goBack: resetState,
                    }}
                />
            ) : (
                <EntriesList
                    flow={{
                        goEditEntry: (entries) =>
                            setState((prev) => {
                                prev.updateEntry = entries;
                            }),
                        goCreateEntry: () =>
                            setState((prev) => {
                                prev.action = 'create';
                            }),
                        goBack: resetState,
                    }}
                />
            )}
        </ViewProvider>
    );
};
