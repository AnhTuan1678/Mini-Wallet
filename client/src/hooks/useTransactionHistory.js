import { useState, useEffect, useCallback } from 'react';
import { getTransactionHistoryAPI } from '../services/transactionApi';
import useAuth from '../contexts/useAuth';

export const useTransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pocket, setPocket] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [filters, setFilters] = useState({
    status: '',
    transRefId: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });

  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  const { token } = useAuth();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const filterParams = {
        ...filters,
        sortField,
        sortOrder,
      };

      const data = await getTransactionHistoryAPI(token, filterParams);

      setPocket(data.pocket);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  }, [token, filters, sortField, sortOrder]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  const resetFilters = () => {
    setFilters({
      status: '',
      transRefId: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
    });
  };

  return {
    loading,
    error,
    pocket,
    transactions,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    resetFilters,
  };
};
