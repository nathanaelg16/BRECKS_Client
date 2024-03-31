import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {MONTHS} from "@/app/utils";
import {Red_Hat_Display} from "next/font/google";
import {Stack} from "@mui/joy";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useContext} from "react";
import {JobContext} from "@/app/(app)/job/[id]/job_context";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

const {DateTime} = require('luxon')

export default function CalendarControl({sx, calendarState}) {
    const [job, _] = useContext(JobContext)
    const [calendar, updateCalendar] = calendarState

    const defaultArrowSX = {borderRadius: 15, fontSize: 36, color: 'var(--joy-palette-neutral-800)'}

    const enabledArrowSX = () => {
        const sx = {...defaultArrowSX}
        sx['&:hover'] = {background: 'var(--joy-palette-neutral-50)', cursor: 'pointer'}
        return sx
    }

    const disabledArrowSX = () => {
        const sx = {...defaultArrowSX}
        sx.color = '#594A4080'
        return sx
    }

    return <Box sx={{...sx, display: 'flex', textAlign: 'center'}}>
        <Stack direction='row' columns={3} spacing={2} sx={{mx: 'auto'}} alignItems='center'>
            <KeyboardArrowLeftIcon onClick={() => updateCalendar(-1)} sx={!(calendar.month === DateTime.fromISO(job.startDate).month - 1) ? enabledArrowSX() : disabledArrowSX()}/>
            <Typography className={RedHatFont.className} level='h2' sx={{userSelect: 'none', WebkitUserSelect: 'none'}}>{`${MONTHS[calendar.month]} ${calendar.year}`}</Typography>
            <KeyboardArrowRightIcon onClick={() => updateCalendar(1)} sx={!(calendar.today.getMonth() === calendar.month && calendar.today.getFullYear() === calendar.year) ? enabledArrowSX() : disabledArrowSX()} />
        </Stack>
    </Box>
}
