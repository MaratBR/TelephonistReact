export function ellipsize(length: number, v: string) {
  const result = v.replace(/[\t\n]/, '').replace(/\s{2,}/, '');
  if (length < 3) return result;
  if (result.length > length) return `${result.substring(0, length - 3)}...`;
  return result;
}

export function ellipsizeFn(length: number): (v: string) => string {
  return (v) => ellipsize(length, v);
}

export function isYes(v: string): boolean {
  return ['y', '1', 'yes', 'true', 't', '+'].includes(v);
}

export function isNo(v: string): boolean {
  return ['n', '0', 'no', 'false', 'f', '-'].includes(v);
}

export function getMeta(name: string) {
  const $meta = document.querySelector(`meta[name="${name}"]`);
  if (!$meta) return undefined;
  const content = $meta.getAttribute('content');
  return content;
}
