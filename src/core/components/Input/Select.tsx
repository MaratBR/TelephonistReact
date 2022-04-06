import React, { useCallback, useRef, useState } from 'react';
import InputBox from './InputBox';
import S from './Select.module.scss';
import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import classNames from 'classnames';
import useOnClickOutside from 'hooks/useOnClickOutside';

interface OptionProps {
  onSelect: () => void;
  selected: boolean;
  children?: React.ReactNode;
}

function Option({ onSelect, selected, children }: OptionProps) {
  const onKeyPress = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') onSelect();
  }, []);

  return (
    <div
      onClick={onSelect}
      onKeyPress={onKeyPress}
      tabIndex={0}
      role="option"
      aria-selected={selected}
      className={classNames(S.option, {
        [S.selected]: selected,
      })}
    >
      {children}
    </div>
  );
}

function defaultRenderElement(element: any): React.ReactNode {
  if (React.isValidElement(element)) return element;
  const type = typeof element;
  if (type === 'boolean' || type === 'string' || element === null) return element;
  return 'failed to render this element';
}

export interface SelectProps<T> {
  options: T[];
  keyFactory: (value: T) => React.Key;
  renderElement?: (value: T) => React.ReactNode;
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
}

function Select<T>({
  options,
  keyFactory,
  renderElement,
  value: selected,
  onChange,
  placeholder,
}: SelectProps<T>) {
  const render = renderElement ?? defaultRenderElement;
  const selectedElement = typeof selected === 'undefined' ? undefined : render(selected);

  const [expanded, setExpanded] = useState(false);
  const divRef = useRef<HTMLDivElement>();

  useOnClickOutside(divRef, () => {
    setExpanded(false);
  });

  const onClick = useCallback(() => setExpanded(!expanded), [expanded]);
  const onSelectX = useCallback(
    (value: T) => {
      setExpanded(false);
      onChange(value);
    },
    [onChange]
  );

  return (
    <InputBox>
      <div
        ref={divRef}
        aria-haspopup="true"
        aria-expanded={expanded}
        className={classNames(S.select, { [S.expanded]: expanded })}
      >
        <div role="button" tabIndex={0} onClick={onClick} className={S.selectedItem}>
          {selectedElement ?? placeholder}
        </div>
        <div className={S.items}>
          {options.map((value) => (
            <Option
              key={keyFactory(value)}
              selected={value === selected}
              onSelect={() => onSelectX(value)}
            >
              {render(value)}
            </Option>
          ))}
        </div>
        <div className={S.chevron}>
          <Icon size={0.9} path={mdiChevronDown} />
        </div>
      </div>
    </InputBox>
  );
}

export default Select;
