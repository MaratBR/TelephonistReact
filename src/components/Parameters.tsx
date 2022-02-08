import React from "react";
import { Field, Fields } from "./Field";

export default function Parameters({
  parameters,
}: {
  parameters: Record<string, React.ReactNode>;
}) {
  return (
    <Fields>
      {Object.entries(parameters).map((kv, index) => {
        return (
          <Field key={index + ":" + kv[0]} name={kv[0]}>
            {kv[1]}
          </Field>
        );
      })}

    </Fields>
        
  );
}
