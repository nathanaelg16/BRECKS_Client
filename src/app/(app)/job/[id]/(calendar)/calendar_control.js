import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {MONTHS} from "@/app/utils";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarControl({sx, calendarState}) {
    const [calendar, setCalendar] = calendarState

    return <Box sx={{...sx, display: 'flex', textAlign: 'center'}}>
        <Typography className={RedHatFont.className} level='h2' sx={{mx: 'auto'}}>{`${MONTHS[calendar.month]} ${calendar.year}`}</Typography>
    </Box>
}
