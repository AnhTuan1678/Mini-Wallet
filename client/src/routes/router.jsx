import { createBrowserRouter } from 'react-router-dom';

import DefaultLayout from '../layouts/DefaultLayout';

import TransactionHistory from '../pages/History/TransactionHistory';
import Wallet from '../pages/Wallet/Wallet';
import Auth from '../components/auth';
import Transfer from '../pages/Transfer/Transfer';
import WalletList from '../pages/Wallet/WalletList';
import ServiceCreate from '../pages/Service/ServiceCreate';
import UserManagement from '../pages/UserManagement/UserManagement';
import CashInIndex from '../pages/CashIn/CashInIndex';
import CashIn from '../pages/CashIn/CashIn';
import ServiceList from '../pages/Service/ServiceList';
import BillPayment from '../pages/BillPayment/BillPayment';
import ServiceProvider from '../contexts/ServiceProvider';

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
      {
        path: 'bill-payment',
        element: <BillPayment />,
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
        element: <UserManagement />,
      },
      {
        path: 'service/create',
        element: (
          <ServiceProvider>
            <ServiceCreate />
          </ServiceProvider>
        ),
      },
      {
        path: 'cash-in',
        element: <CashInIndex />,
      },
      {
        path: 'cash-in/:serviceCode',
        element: <CashIn />,
      },
      {
        path: 'services',
        element: <ServiceList />,
      },
    ],
  },
]);

export default router;
