import { Box, BoxProps } from "@chakra-ui/react";

export const ContentBox = (props: BoxProps) => (
  <Box
    backgroundColor="front"
    boxShadow="md"
    borderRadius="xl"
    padding={5}
    {...props}
  />
);
