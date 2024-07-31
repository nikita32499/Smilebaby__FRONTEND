declare type RootState = ReturnType<
    typeof import('../src/app/_providers/store').rootReducers
>;
declare type AppStore = ReturnType<
    typeof import('../src/app/_providers/store').setupStore
>;
declare type AppDispatch = AppStore['dispatch'];
declare type FC<P = NonNullable<unknown>> = React.FunctionComponent<P>;

type UiErrors = Record<string, string | null>;

declare type UiState = {
    errors?: string;
};
