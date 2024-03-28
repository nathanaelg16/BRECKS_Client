import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Accordion, AccordionDetails, AccordionSummary, Chip, Stack} from "@mui/joy";
import {Red_Hat_Display} from "next/font/google";
import JobViewStatusChanger from "@/app/(app)/job/[id]/(sidebar)/status_change";
import {JOB_STATUS} from "@/app/utils";
import JobData from "@/app/(app)/job/[id]/(sidebar)/job_data";
import JobStats from "@/app/(app)/job/[id]/(sidebar)/(stats)/job_stats";
import {useContext} from "react";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Sidebar({sx, calendar, statsState}) {
    let [job, _] = useContext(JobContext)

    const header = <Stack flex={1} sx={{height: {lg: 'auto', xs: 1}, mx: {lg: 'auto', xs: 0}, justifyContent: 'center'}}>
        <Box sx={{mx: 'auto', textAlign: 'center'}}>
            <Typography className={RedHatFont.className} level={'h2'}>{job.address}</Typography>
            {!!job.identifier && <Typography className={RedHatFont.className} level={'h3'}>({job.identifier})</Typography>}
        </Box>
        <Chip color='primary' sx={{mx: 'auto', mt: 2}}>
            <Typography className={RedHatFont.className} fontWeight='800' level='title' fontSize='lg'>{JOB_STATUS[job.status]}</Typography>
        </Chip>
    </Stack>

    const small = <Accordion size='sm' variant='soft' color='neutral' sx={{display: {xs: 'unset', lg: 'none'}}}>
        <AccordionSummary sx={{py: 2}} indicator={<ExpandCircleDownIcon sx={{fontSize: 28, mr: 5}} />}>
            {header}
            <JobData sx={{flex: 1, height: 'fit-content', background: 'none'}} />
        </AccordionSummary>
        <AccordionDetails variant='plain' sx={{background: 'white', border: '1px solid black'}}>
            <Stack sx={{py: 2}} flexDirection='row' justifyContent='center' alignItems='start' spacing={3} useFlexGap>
                <JobViewStatusChanger sx={{flex: 1}} />
                <JobStats sx={{flex: 1}} calendar={calendar} statsState={statsState} />
            </Stack>
        </AccordionDetails>
    </Accordion>

    const medium = <Box sx={{...sx, borderLeft: '2px solid gray', px: 2, pt: 2, display: {lg: 'flex', xs: 'none'}, flexDirection: 'column', background: 'var(--joy-palette-neutral-50)', overflowY: 'scroll', width: 1, gap: 3, justifyContent: 'flex-start', alignItems: 'center'}}>
        {header}
        <JobData sx={{width: 1}} />
        <JobViewStatusChanger />
        <JobStats calendar={calendar} statsState={statsState} />
    </Box>

    return <>
        {small}
        {medium}
    </>
}

//1095px
