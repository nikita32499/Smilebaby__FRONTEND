'use client';

import { setupStore } from '@/store/store';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

const store = setupStore();

const ReduxProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
