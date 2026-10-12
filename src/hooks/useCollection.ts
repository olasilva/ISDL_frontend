// src/hooks/useCollection.ts
import { useEffect, useState } from 'react';
import { subscribe } from '../lib/db';

export function useCollection<T = any>(
  collection: string,
  initial: T[] = []
): T[] {
  const [data, setData] = useState<T[]>(initial);

  useEffect(() => {
    const unsubscribe = subscribe(collection, (rows: any[]) => {
      setData(rows as T[]);
    });
    return unsubscribe;
  }, [collection]);

  return data;
}