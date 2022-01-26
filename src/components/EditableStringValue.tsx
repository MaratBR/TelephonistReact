import { useEffect, useState } from "react";
import StringValue from "./StringValue";
import { HStack } from ".";

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
          icon={
            props.isLoading ? (
              <CircularProgress isIndeterminate size="xs" />
            ) : (
              <i className="fa " />
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
        aria-label={t("edit")}
        icon={<i className="fa " />}
      />
    </HStack>
  );
}
