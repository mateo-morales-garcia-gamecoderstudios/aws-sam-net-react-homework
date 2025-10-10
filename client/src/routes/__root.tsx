import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import type { fetchRewards } from '@/data/rewards-data';
import type { IAuthContextType } from '@/lib/auth';
import Header from '../components/Header';

export const Route = createRootRouteWithContext<{
  fetchRewards: typeof fetchRewards,
  auth: IAuthContextType,
}>()({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
});
