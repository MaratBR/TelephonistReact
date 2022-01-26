import { Link, NavLink } from "react-router-dom";
import { models, ws } from "~src/api";
import HStack from "./HStack";
import { useTranslation } from "react-i18next";
import DataGrid, { DataGridColumn } from "./DataGrid";
import { Centered } from ".";
import Icon from "@mdi/react";
import { mdiConnection } from "@mdi/js";
import { css } from "@emotion/react";
import LoadingSpinner from "./LoadingSpinner";

const noContentCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
`

const EventsViewer = (props: { events: models.Event[] }) => {
  const { t } = useTranslation();

  const columns: DataGridColumn<models.Event>[] = [
    {
      key: "_id",
      render: (v) => (
        <Link to={"/events/" + v}>
          <code>{v}</code>
        </Link>
      ),
      title: t("id"),
    },
    {
      key: "event_info",
      render: ({ event_key, event_type, related_task }) => (
        <div>
          {t("event_key")}:{" "}
          <Link to={{ pathname: "/events", search: "event_key=" + event_key }}>
            <code>{event_key}</code>
          </Link>{" "}
          <br />
          {t("related_task")}:{" "}
          <Link
            to={{ pathname: "/events", search: "related_task=" + related_task }}
          >
            <code>{related_task}</code>
          </Link>{" "}
          <br />
          {t("event_type")}:{" "}
          <Link
            to={{ pathname: "/events", search: "event_type=" + event_type }}
          >
            <code>{event_type}</code>
          </Link>{" "}
          <br />
        </div>
      ),
      title: t("event_info"),
      custom: true,
    },
    {
      key: "created_at",
      render: (v) => {
        const d = new Date(v);
        return d.toLocaleString();
      },
      title: t("created_at.event"),
    },
    {
      key: "publisher_ip",
      title: t("publisher_ip"),
    },
    {
      key: "sequence_id",
      title: t("sequence_id"),
      render: (v) => v ?? "-",
    },
  ];

  return (
    <DataGrid
      keyFactory={(e) => e._id}
      selectable
      data={props.events}
      columns={columns}
      noItemsRenderer={() => <div css={noContentCSS}>
        {
          props.events ? <Icon size={2} path={mdiConnection} /> : <LoadingSpinner size={2} />
        }
        <span>
          {props.events ? t("no_events") : t("loading")}
        </span>
      </div>}
    />
  );
};

export default EventsViewer;

export function EventView(props: { event: models.Event }) {
  const { event_type, event_key, related_task, sequence_id } = props.event;
  const created_at = new Date(props.event.created_at);
  const { t } = useTranslation();

  return (
    <div>
      <HStack>
        <Link
          to={"/events?event_key=" + event_key}
          title={
            t("task_name") +
            ": " +
            related_task +
            ", " +
            t("event_type") +
            ": " +
            event_type
          }
        >
          {event_key}
        </Link>
        <span>&bull;</span>
        <span>
          {created_at.toLocaleDateString()} {created_at.toLocaleTimeString()}
        </span>
        <div>
          {sequence_id ? <span>{sequence_id}</span> : <span>no sequence</span>}
        </div>
      </HStack>
    </div>
  );
}
