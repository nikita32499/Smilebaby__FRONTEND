import { PropsWithChildren, createContext } from 'react';
import { useImmerState } from 'shared/hook/useImmerState';
import { ImagePreviewComponent } from '../ImagePreview/ImagePreview';

type TBehavior = 'hide_all';

interface IPropsViewProvider extends PropsWithChildren {}

type TStateImagePreview = {
    imagePreview: {
        file: File;
        apply: () => void;
    } | null;
};

export interface IViewContext {
    state: TStateImagePreview;
    setState: ReturnType<typeof useImmerState<TStateImagePreview>>[1];
}

export const ViewContext = createContext<IViewContext>(null!);

export const ViewProvider: FC<IPropsViewProvider> = (props) => {
    const { children } = props;
    const [state, setState] = useImmerState<TStateImagePreview>({
        imagePreview: null,
    });

    return (
        <ViewContext.Provider
            value={{
                state,
                setState,
            }}
        >
            {children}
            <ImagePreviewComponent />
        </ViewContext.Provider>
    );
};
