'use client';
import { Card } from 'antd';
import { useImmerState } from 'shared/hook/useImmerState';

import { isNotBrowser } from 'shared/helpers/isNotBrowser';
import { switchCheckDefault } from 'shared/helpers/switch';
import { ViewProvider } from 'shared/ui/ViewProvider/ViewProvider';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { CreateUpdateItem } from './CreateItem/CreateUpdateItem';
import { ItemList } from './ItemList/ItemList';

interface IStateItemPanelPage {
    updateItem?: IItem;
    action: 'list' | 'create';
}

const initialState = (): IStateItemPanelPage => ({
    action: 'list',
});

export const ItemPanelPage: FC = () => {
    if (isNotBrowser()) return null;
    const [state, setState, resetState] =
        useImmerState<IStateItemPanelPage>(initialState());

    const renderSwitch = () => {
        if (state.updateItem) {
            return (
                <CreateUpdateItem
                    updateItem={state.updateItem}
                    flow={{
                        goBack: resetState,
                    }}
                />
            );
        }
        switch (state.action) {
            case 'list':
                return (
                    <ItemList
                        flow={{
                            goUpdateItem: (item) =>
                                setState((prev) => {
                                    prev.updateItem = item;
                                }),

                            goCreate: () =>
                                setState((prev) => {
                                    prev.action = 'create';
                                }),
                        }}
                    />
                );
            case 'create':
                return (
                    <CreateUpdateItem
                        flow={{
                            goBack: resetState,
                        }}
                    />
                );

            default:
                return switchCheckDefault(state.action);
        }
    };

    return (
        <ViewProvider>
            <Card>
                {renderSwitch()}
                {/* <ImagePreviewComponent /> */}
            </Card>
        </ViewProvider>
    );
};
