import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {MONTHS} from "@/app/utils";
import {Red_Hat_Display} from "next/font/google";
import {Stack} from "@mui/joy";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarControl({sx, calendarState}) {
    const [calendar, updateCalendar] = calendarState

    return <Box sx={{...sx, display: 'flex', textAlign: 'center'}}>
        <Stack direction='row' columns={3} spacing={2} sx={{mx: 'auto'}} alignItems='center'>
            <KeyboardArrowLeftIcon onClick={() => updateCalendar(-1)} sx={{borderRadius: 15, fontSize: 36, cursor: 'pointer', color: 'var(--joy-palette-neutral-800)', '&:hover': {background: 'var(--joy-palette-neutral-50)'}}}/>
            <Typography className={RedHatFont.className} level='h2' sx={{userSelect: 'none', WebkitUserSelect: 'none'}}>{`${MONTHS[calendar.month]} ${calendar.year}`}</Typography>
            <KeyboardArrowRightIcon onClick={() => updateCalendar(1)} sx={{borderRadius: 15, fontSize: 36, cursor: 'pointer', color: 'var(--joy-palette-neutral-800)', '&:hover': {background: 'var(--joy-palette-neutral-50)'}}} />
        </Stack>
    </Box>
}
