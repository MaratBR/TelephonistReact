interface ErrorProps {
  error: any;
}

export default function Error({ error }: ErrorProps) {
  if (typeof error === "undefined" || error === null) return null;
  return <pre>{error ? error.toString() : 'null'}</pre>;
}
