'use client';

// import { deleteUsers } from 'api/users.api';
import { useState } from 'react';

import { ImagePreviewComponent } from 'shared/ui/ImagePreview/ImagePreview';

import { IViewUnion } from 'shared_SmileBaby/dist/types/view-custom.types';

import { ChangeViewElement } from './ChangeViewElement/ChangeViewElement';
import { ViewList } from './ViewList/ViewList';

import { ViewApi } from 'entities/view';
import { isNotBrowser } from 'shared/helpers/isNotBrowser';
import { deepCopy } from 'shared/helpers/object';
import { ViewProvider } from 'shared/ui/ViewProvider/ViewProvider';

interface IStateAdminPanel {
    editView?: IViewUnion;
    action: null;
}

const initialState = (): IStateAdminPanel => ({
    action: null,
});

export const ViewPanelPage = () => {
    if (isNotBrowser()) return;

    const [state, setState] = useState<IStateAdminPanel>(initialState());

    const ViewGetAll = ViewApi.useGetAllQuery();

    const views = deepCopy(ViewGetAll.data ?? []);

    return (
        <ViewProvider>
            <div>
                {state.editView ? (
                    <ChangeViewElement
                        view={state.editView}
                        rerender={() => setState((prev) => ({ ...prev }))}
                        flow={{ goBack: () => setState(initialState()) }}
                    />
                ) : (
                    <ViewList
                        flow={{
                            goEdit: (view: IViewUnion) =>
                                setState((prev) => {
                                    prev.editView = view;
                                    return { ...prev };
                                }),
                        }}
                        viewsList={views}
                    />
                )}

                <ImagePreviewComponent />
            </div>
        </ViewProvider>
    );
};
