import { useEffect, useState } from 'react';
import { subscribe } from '../lib/db';

export function useCollection(collection, initial = []) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const unsubscribe = subscribe(collection, (rows) => {
      setData(rows);
    });
    return unsubscribe;
  }, [collection]);

  return data;
}