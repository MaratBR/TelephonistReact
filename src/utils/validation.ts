export const IDENT_REGEX = /^[\d\w%^$#&-]+$/;

export function isIdent(v: string) {
  return v.length > 0 && IDENT_REGEX.test(v);
}
