import React from 'react';
import { Stack } from 'core/components/Stack';

function ButtonGroup({ children }: React.PropsWithChildren<{}>) {
  return (
    <Stack h spacing="sm">
      {children}
    </Stack>
  );
}

export default ButtonGroup;
