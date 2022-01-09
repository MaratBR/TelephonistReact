import {
  Box,
  CircularProgress,
  HStack,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { StringValue } from ".";
import { FaPen, FaSave } from "react-icons/fa";

type EditableStringValueProps = {
  value?: string | null;
  onValueChanged?: (value: string) => void;
  isLoading?: boolean;
};

export default function EditabledStringValue(props: EditableStringValueProps) {
  const [isEditing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(props.value);

  useEffect(() => {
    if (isEditing) {
      setNewValue(props.value);
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <HStack>
        <Input
          variant="flushed"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <IconButton
          size="xs"
          aria-label={t`Save`}
          icon={
            props.isLoading ? (
              <CircularProgress isIndeterminate size="xs" />
            ) : (
              <FaSave />
            )
          }
        />
      </HStack>
    );
  }

  return (
    <HStack>
      <Box width="100%">
        <StringValue value={props.value} />
      </Box>
      <IconButton
        onClick={() => setEditing(true)}
        size="xs"
        aria-label={t`Edit`}
        icon={<FaPen />}
      />
    </HStack>
  );
}
