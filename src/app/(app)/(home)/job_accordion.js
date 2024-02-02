import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary} from "@mui/joy";
import {useState} from "react";
import JobScrollView from "@/app/(app)/(home)/job_scroll_view";

export default function JobAccordion({jobs}) {
    const [expansionState, setExpansionState] = useState({
        'ACTIVE': true,
        'ON HOLD': true,
        'COMPLETED': true,
        'NOT STARTED': true
    })

    const accordion = (status, data) => {
        if (data == null) data = []
        return (
            <Accordion expanded={expansionState[status]}
                       onChange={(event, expanded) => setExpansionState({...expansionState, [status]: expanded})}>
                <AccordionSummary sx={{fontWeight: '900'}}>{status} ({data ? data.length : 0})</AccordionSummary>
                <AccordionDetails><JobScrollView jobs={data} /></AccordionDetails>
            </Accordion>
        )
    }

    return <AccordionGroup variant='soft' disableDivider={false}>
        {accordion('ACTIVE', jobs.active)}
        {accordion('ON HOLD', jobs.onHold)}
        {accordion('COMPLETED', jobs.completed)}
        {accordion('NOT STARTED', jobs.notStarted)}
    </AccordionGroup>
}
