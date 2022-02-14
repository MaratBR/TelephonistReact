import { Breadcrumb } from "@cc/Breadcrumb";
import LoadingSpinner from "@cc/LoadingSpinner";
import { TextHeader } from "@cc/Text";
import { useApi } from "api/hooks";
import { useRefreshableAsyncValue } from "core/hooks";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import EditApplication from "./EditApplication";
import EditTasks from "./EditTasks";

export default function EditApplicationPage() {
  const api = useApi();
  const { id } = useParams();
  const {
    value,
    error,
    isLoading,
    setValue,
  } = useRefreshableAsyncValue(() => api.getAppliction(id));
  const { t } = useTranslation();

  const applicationName = isLoading ? id : value.app.display_name;

  let content;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else {
    content = (
      <>
        <EditApplication
          onUpdated={(app) => setValue((oldValue) => ({ ...oldValue, app }))}
          app={value.app}
        />
        <EditTasks tasks={value.tasks} />
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t("applications")}</NavLink>
        <NavLink to={`/applications/${id}`}>{applicationName}</NavLink>
        <span>{t("edit")}</span>
      </Breadcrumb>
      <TextHeader title={applicationName} subtitle={id} />
      {content}
    </>
  );
}
