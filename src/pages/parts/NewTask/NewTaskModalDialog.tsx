import { ModalDialog } from "@cc/Modal";
import { TaskStandalone } from "api/definition";

import { useTranslation } from "react-i18next";
import TaskForm from "./TaskForm";

type NewTaskModalDialogProps = {
  onClose: () => void;
  appID: string;
  onSaved?: (task: TaskStandalone) => void;
}

export default function NewTaskModalDialog({ onClose, appID, onSaved }: NewTaskModalDialogProps) {
  const { t } = useTranslation();
  return (
    <ModalDialog onClose={onClose} header={t("newTask")}>
      <TaskForm appID={appID} onSaved={onSaved} />
    </ModalDialog>
  );
}
