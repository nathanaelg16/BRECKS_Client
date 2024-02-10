import Box from "@mui/joy/Box";
import CalendarControl from "@/app/(app)/job/[id]/(calendar)/calendar_control";
import {Red_Hat_Display} from "next/font/google";
import {useState} from "react";
import Typography from "@mui/joy/Typography";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Calendar({sx, calendarState}) {
    const [calendar, setCalendar] = calendarState
    const [data, setData] = useState([])

    return <Box sx={{...sx, display: 'flex', flexDirection: 'column', height: '100%'}}>
        <CalendarControl sx={{my: 1, flex: '0 1 auto'}} calendarState={calendarState}/>
        <Box sx={{flex: '1 1 auto', display: 'grid', gridTemplateRows: '5% 1fr 1fr 1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', width: 1, height: 1}}>
            <Box sx={{gridRow: 1, gridColumnStart: 'span 7', display: 'grid', gridTemplateColumns: 'subgrid', width: 1, height: 1, background: 'var(--joy-palette-neutral-100)', alignItems: 'center'}}>

                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) =>
                    <Typography key={index} className={RedHatFont.className} sx={
                        {
                            gridRow: 1,
                            gridColumn: index,
                            textAlign: 'center',
                            fontWeight: 800,
                            color: '#322720',
                        }
                    }>{day}</Typography>)}

            </Box>
        </Box>
    </Box>
}
