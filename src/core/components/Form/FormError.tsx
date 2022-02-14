import Error from "@cc/Error";
import { useContext } from "react";
import { FormStatusContext } from "./context";

export default function FormError() {
  const ctx = useContext(FormStatusContext);
  if (ctx.error) return <Error error={ctx.error} />;
  return null;
}
