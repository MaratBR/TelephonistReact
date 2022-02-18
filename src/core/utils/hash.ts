import hash from 'object-hash';

export function getHashRecord<T extends object>(array: T[]): Record<string, T> {
  const record: Record<string, T> = {};
  for (const el of array) record[hash(el)] = el;
  return record;
}
