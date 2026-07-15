import { createBrowserRouter } from 'react-router-dom';

import DefaultLayout from '../layouts/DefaultLayout';

import TransactionHistory from '../pages/History/TransactionHistory';
import Wallet from '../pages/Wallet/Wallet';
import Auth from '../components/auth';
import Transfer from '../pages/Transfer/Transfer';
import WalletList from '../pages/Wallet/WalletList';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Auth />,
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        path: 'wallet',
        element: <Wallet />,
      },
      {
        path: 'transactions-history',
        element: <TransactionHistory />,
      },
      {
        path: 'transfer',
        element: <Transfer />,
      },
    ],
  },
  {
    path: '/admin',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        path: 'wallet',
        element: <WalletList />,
      },
      {
        path: 'transactions-history',
        element: <TransactionHistory />,
      },
      {
        path: 'users',
        element: <div>Users</div>,
      },
    ],
  },
]);

export default router;
