import { ReactElement } from 'react';

export function makeTypeChecker(tabsRole) {
  return (element) => !!element.type && element.type.tabsRole === tabsRole;
}

export function isReactElement(value: any): value is ReactElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    !!(value as ReactElement).type &&
    !!(value as ReactElement).props
  );
}
