import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api, { models } from "~src/api";
import { Breadcrumb, ButtonGroup, Card, Heading, Stack } from "~src/components";
import Button from "~src/components/Button";
import DataGrid, {
  DataGridColumn,
  renderBoolean,
  renderObjectID,
} from "~src/components/DataGrid";
import Icon from "@mdi/react";
import { mdiPencil, mdiPlus, mdiTrashCan } from "@mdi/js";

export default function AllApplications(_: {}) {
  const [pagination, setPagination] =
    useState<models.Pagination<models.ApplicationView>>();

  useEffect(() => {
    api.getApplictions({}).then(setPagination);
  }, []);

  const { t } = useTranslation();

  const columns: DataGridColumn<models.ApplicationView>[] = [
    {
      key: "_id",
      title: "ID",
      render: (id) => (
        <NavLink to={"/applications/" + id}>{renderObjectID(id)}</NavLink>
      ),
    },
    { key: "name", title: t("name") },
    { key: "disabled", title: t("disabled"), render: renderBoolean },
    { key: "description", title: t("description") },
    {
      custom: true,
      render: () => (
        <span>
          <Button size="sm" left={<Icon size={1} path={mdiPencil} />}>
            {t("edit")}
          </Button>
        </span>
      ),
      key: "buttons",
      title: "",
    },
  ];

  return (
    <div>
      <Breadcrumb>
        <span>{t("applications")}</span>
        <span>{t("all_applications")}</span>
      </Breadcrumb>
      <Heading>{t("all_applications")}</Heading>

      <Card>
        <ButtonGroup>
          <Button
            to="/applications/new"
            left={<Icon size={1} path={mdiPlus} />}
          >
            {t("create_new")}
          </Button>
          <Button
            disabled
            color="danger"
            left={<Icon size={1} path={mdiTrashCan} />}
          >
            {t("delete")}
          </Button>
        </ButtonGroup>

        <DataGrid
          keyFactory={(a) => a._id}
          selectable
          data={pagination?.result ?? []}
          columns={columns}
        />
      </Card>
    </div>
  );
}
