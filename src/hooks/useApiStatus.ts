import { useMemo } from 'react';
import IApiStatusService from 'api/IApiStatusService';
import axios from 'axios';
import { setApiStatus } from 'reducers/apiStatusReducer';
import { useAppDispatch, useAppSelector } from 'store';

export default function useApiStatus(): IApiStatusService {
  const { isOnline, isReachable } = useAppSelector((state) => state.apiStatus);
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      isOnline,
      isReachable,
      apiCall: async (promise) => {
        try {
          const result = await promise;
          if (result) return result.data;
          return undefined;
        } catch (e) {
          if (axios.isAxiosError(e) && e.message === 'Network Error') {
            dispatch(setApiStatus({ isOnline: navigator.onLine ?? true, isReachable: false }));
          }
          throw e;
        }
      },
    }),
    [isOnline, isReachable]
  );
}
