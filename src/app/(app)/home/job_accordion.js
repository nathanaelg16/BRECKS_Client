import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary} from "@mui/joy";
import {useEffect, useState} from "react";
import JobScrollView from "@/app/(app)/home/job_scroll_view";

export default function JobAccordion({jobs}) {
    const [expansionState, setExpansionState] = useState({
        'ACTIVE': false,
        'ON HOLD': false,
        'COMPLETED': false,
        'NOT STARTED': false
    })

    useEffect(() => {
        setExpansionState({
            'ACTIVE': jobs.active?.length > 0,
            'ON HOLD': jobs.onHold?.length > 0,
            'COMPLETED': jobs.completed?.length > 0,
            'NOT STARTED': jobs.notStarted?.length > 0
        })
    }, [jobs, setExpansionState])

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
