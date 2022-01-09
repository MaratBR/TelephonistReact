import { Box, Code, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { t } from "@lingui/macro";
import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";
import { models, ws } from "~src/api";
import { useLiveEvents } from "~src/api/hooks";

const EventsViewer = (props: {descriptor: ws.SubscribeEventsData}) => {
    const [{value, loading, error}, refetch] = useLiveEvents(props.descriptor, 500)

    return <Stack>
        {value.map(e => <EventView key={e._id} event={e} />)}
    </Stack>
}

export default observer(EventsViewer)

export function EventView(props: {event: models.Event}) {
    const {event_type, event_key, related_task, sequence_id} = props.event
    const created_at = new Date(props.event.created_at)
    return <Box padding={2} borderBottom="1px solid" borderColor="gray.200">
        <HStack> spacing={2}
            <Link as={NavLink} 
                to={"/events?event_key=" + event_key} title={t`Task name` + ": " + related_task + ", " + t`Event type` + ": " + event_type}>{event_key}</Link>
            <span>&bull;</span>
            <Text as="span">{created_at.toLocaleDateString()} {created_at.toLocaleTimeString()}</Text>

            <Box marginLeft="auto !important" borderRadius="md" backgroundColor="blue.700" paddingX={1}>
                {sequence_id ? <Text>{sequence_id}</Text> : <Text>no sequence</Text>}   
            </Box>
        </HStack>
    </Box>
}