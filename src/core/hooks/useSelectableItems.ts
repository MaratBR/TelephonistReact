import { useEffect, useState } from 'react';

interface UseSelectableItems {
  selected: boolean[];
  isSelected(index: number): boolean;
  allState: boolean | null;
  set(index: number, selected: boolean): void;
  setAll(selected: boolean): void;
}

function fullOf(value: boolean, length: number): boolean[] {
  return new Array(length).fill(1).map(() => value);
}

export default function useSelectableItems(
  length: number,
  initiallySelected?: boolean
): UseSelectableItems {
  const [selected, setSelected] = useState(() => fullOf(initiallySelected ?? false, length));
  const [selectedCount, setSelectedCount] = useState(() => (initiallySelected ? length : 0));

  useEffect(() => {
    if (selected.length !== length) {
      const newSelected =
        selected.length > length
          ? selected.slice(0, length)
          : selected.concat(fullOf(initiallySelected ?? false, length - selected.length));
      setSelected(newSelected);
      setSelectedCount(newSelected.filter((v) => v).length);
    }
  }, [length]);

  let allState = selectedCount === length;
  if (allState === false && selectedCount !== 0) allState = null;

  return {
    selected,
    allState,
    setAll: (value) => {
      setSelected(fullOf(value, length));
      setSelectedCount(value ? length : 0);
    },
    isSelected: (index) => (index < 0 || index >= selected.length ? false : selected[index]),
    set: (index, value) => {
      if (index < 0 || index >= selected.length || selected[index] === value) return;
      setSelectedCount(selectedCount + (value ? 1 : -1));
      const newSelected = [...selected];
      newSelected[index] = value;
      setSelected(newSelected);
    },
  };
}
