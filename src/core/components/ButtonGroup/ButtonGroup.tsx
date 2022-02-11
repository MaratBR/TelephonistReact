import { Stack } from 'core/components/Stack';
import React from 'react';

function ButtonGroup({ children }: React.PropsWithChildren<{}>) {
  return (
    <Stack h spacing="sm">
      {children}
    </Stack>
  );
}

export default ButtonGroup;
