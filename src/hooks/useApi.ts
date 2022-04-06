import { useContext } from 'react';
import { ApiInstanceContext } from 'api/context';

export default function useApi() {
  const api = useContext(ApiInstanceContext);

  if (api === null)
    throw new Error(
      'api instance is not available, did you wrap the components tree with ApiProvider?'
    );
  return api;
}
