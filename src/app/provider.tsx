'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import AuthInitializer from '@/components/layout/AuthInitializer';
import AutoRoleSwitch from '@/components/layout/AutoRoleSwitch';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <AuthInitializer>
        <AutoRoleSwitch />
        {children}
      </AuthInitializer>
    </ReduxProvider>
  );
};

export default Provider;
