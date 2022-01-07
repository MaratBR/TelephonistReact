import { Table, Tbody, Td, Tr } from "@chakra-ui/react";
import React from "react";

export default function Parameters({
  parameters,
}: {
  parameters: Record<string, React.ReactNode>;
}) {
  return (
    <Table>
      <Tbody>
        {Object.entries(parameters).map((kv) => {
          return (
            <Tr>
              <Td>{kv[0]}</Td>
              <Td>{kv[1]}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
