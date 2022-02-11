const CSS_VARIABLE_PREFIXES = ['xs', 'sm', 'md', 'lg', 'xl'];

export function maybeCSSVariable<T>(value: T, variablePrefix: string): T {
  if (
    typeof value === 'string'
    && CSS_VARIABLE_PREFIXES.indexOf(value) !== -1
  ) {
    return `var(--t-${variablePrefix}-${value})` as unknown as T;
  }
  return value;
}
