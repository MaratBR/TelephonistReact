import React from "react";
import Table from "./Table";

export default function Parameters({
  parameters,
}: {
  parameters: Record<string, React.ReactNode>;
}) {
  return (
    <Table>
      <tbody>
        {Object.entries(parameters).map((kv, index) => {
          return (
            <tr key={`${index}.${kv[0]}`}>
              <td>{kv[0]}</td>
              <td>{kv[1]}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
