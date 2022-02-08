interface ErrorProps {
  error: any;
}

export default function ErrorView({ error }: ErrorProps) {
  return <pre>{error ? error.toString() : "null"}</pre>;
}
