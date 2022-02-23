import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export default function useRxObservable<T>(observable: Observable<T>) {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    const sub = observable.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [observable]);
  return value;
}
