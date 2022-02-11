import { models } from "api";

type EventsViewerProps = {
  events: models.Event[];
}

function EventsViewer({ events }: EventsViewerProps) {
  return (
    <div>
      {JSON.stringify(events)}
    </div>
  );
}

export default EventsViewer;
