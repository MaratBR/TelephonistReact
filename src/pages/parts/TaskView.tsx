import { models } from "@/api";
import { useState } from "react";
import S from "./TaskView.module.scss";
import cn from "classnames"
import { Button, IconButton, Parameters, Tags } from "@/components";
import { useTranslation } from "react-i18next";
import { Input } from "@/components"
import Textarea from "@/components/Textarea"
import ReactJson from "react-json-view"
import Icon from "@mdi/react";
import { mdiPencil } from "@mdi/js";

type TaskViewProps = {
  task: models.ApplicationTask;
  editable?: boolean
};

export function TaskView({ task, editable }: TaskViewProps) {
  const [appName, taskName] = task.qualified_name.split("/")
  const [collapsed, setCollapsed] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const { t } = useTranslation()

  let body

  if (!collapsed) {
    if (editMode) {
      
    } else {
      body = <>
        <div className={S.buttons}>
          <Button left={<Icon path={mdiPencil} size={1} />}>
            {t("edit")}
          </Button>
        </div>
        <Parameters parameters={{
          [t("id")]: <code>{task._id}</code>,
          [t("name")]: task.name + " (" + task.qualified_name + ")",
          [t("description")]: task.description,
          [t("task_type")]: <span>{task.task_type}</span>,
          [t("task_body")]: <TaskBodyView value={task.body} type={task.task_type} />,
          [t("tags")]: <Tags tags={task.tags} />
        }} />
      </>
    }
    
  }

  return <div className={cn(S.root, {[S.expanded]: !collapsed})} role="button">
    <div className={S.header} onClick={() => setCollapsed(!collapsed)}>
      <h3>
        <span className={S.appName}>{appName}/</span>
        <span>{taskName}</span>
      </h3>
      <span className={S.id}>{task._id}</span>
    </div>

    <div className={S.body}>
      {body}
    </div>
  </div>;
}


type TaskBodyProps = {
    value: any
    type: models.ApplicationTaskType
}

function TaskBodyView({value, type}: TaskBodyProps) {
    if (type == "arbitrary") {
        return <ReactJson src={value} />
    } else if (type == "exec") {
        return <Input value={value} readOnly />
    } else if (type == "script") {
        return <Textarea value={value} readOnly />
    } else {
      return <span>"invalid task type"</span>
    }
}