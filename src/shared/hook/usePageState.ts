import { useImmerState } from './useImmerState';

interface IBasePageState {
    data?: Record<string, unknown>;
    view: Record<string, TViewsState>;
    errors: Record<string, string | null>;
}

// type TypeSetErrors = Partial<IState['errors']>

export type TViewsState = string | number | boolean;

export const usePageState = <IState extends IBasePageState>(initState: IState) => {
    const [state, setState] = useImmerState<IState>(initState);

    function setError<K extends keyof IState['errors']>(name: K, error: string | null) {
        const fn = (name: K, error: string | null) => {
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    [name]: error,
                },
            }));
        };
        setTimeout(() => {
            fn(name, null);
        }, 15000);
        fn(name, error);
    }

    function isActiveView<K extends keyof IState['view']>(
        name: K,
        id?: TViewsState,
    ): boolean {
        const viewValue = state.view[name] as TViewsState;
        return typeof viewValue === 'boolean' ? viewValue : viewValue === id;
    }
    function setView(...views: { name: keyof IState['view']; id: TViewsState }[]) {
        setState((prev) => {
            const newView = { ...prev.view };
            views.forEach((view) => {
                (newView[view.name] as TViewsState) = view.id;
            });
            return {
                ...prev,
                view: newView,
            };
        });
    }

    return { state, setState, setError, isActiveView, setView };
};
