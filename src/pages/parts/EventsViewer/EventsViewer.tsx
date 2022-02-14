import { Event } from 'api/definition';

type EventsViewerProps = {
  events: Event[];
};

function EventsViewer({ events }: EventsViewerProps) {
  return <div>{JSON.stringify(events)}</div>;
}

export default EventsViewer;
