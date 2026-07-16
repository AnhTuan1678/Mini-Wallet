import { useContext } from 'react';
import ServiceContext from './ServiceContext';

export default function useService() {
  return useContext(ServiceContext);
}
