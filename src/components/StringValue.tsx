import { Text } from "@chakra-ui/react";
import { t } from "@lingui/macro";

export default function StringValue({ value }: { value?: null | string }) {
  return value ? (
    <>{value}</>
  ) : (
    <Text as="span" color="gray.500">{t`empty`}</Text>
  );
}
