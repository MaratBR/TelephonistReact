import { useGlobalState } from 'state/hooks';

export default function useApi() {
  return useGlobalState().api;
}
