import Box from "@mui/joy/Box";
import CalendarControl from "@/app/(app)/job/[id]/(calendar)/calendar_control";
import {Red_Hat_Display} from "next/font/google";
import {useEffect, useState} from "react";
import Typography from "@mui/joy/Typography";
import {Range} from "immutable"
import {Stack, Tooltip} from "@mui/joy";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CircleIcon from '@mui/icons-material/Circle';
import {JOB_STATUS, JOB_STATUS_COLORS} from "@/app/utils";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Calendar({sx, calendarState, stats}) {
    const [calendar, updateCalendar] = calendarState
    const [data, setData] = useState([])
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(0)

    useEffect(() => {
        const firstOfMonth = new Date(calendar.year, calendar.month, 1)

        const firstDayOfMonth = firstOfMonth.getUTCDay()
        setFirstDayOfMonth(firstDayOfMonth)

        const lastOfPreviousMonth = new Date(firstOfMonth.getTime())
        lastOfPreviousMonth.setDate(0)

        const lastDateOfPreviousMonth = lastOfPreviousMonth.getUTCDate()

        const lastOfMonth = new Date(calendar.year, calendar.month + 1, 1)
        lastOfMonth.setDate(0)

        const lastDateOfMonth = lastOfMonth.getUTCDate()

        let antefillIns = firstDayOfMonth > 0 ?
            Range(lastDateOfPreviousMonth - firstDayOfMonth + 1, lastDateOfPreviousMonth + 1)
            : Range(0, 0)
        antefillIns = antefillIns.map((v) => {
            return {
                date: v,
                sx: {
                    background: 'var(--joy-palette-neutral-200)',
                    '&:hover': {
                        background: 'var(--joy-palette-neutral-500)'
                    }
                },
                onClick: () => {
                    updateCalendar(-1)
                }
            }
        })

        const jobStatusPerDay = Array(lastDateOfMonth + 1)
        if (stats.statusHistory) Object.entries(stats.statusHistory).forEach(([key, value]) => {
            value.forEach((interval) => {
                Range(new Date(interval.startDate).getUTCDate(), new Date(interval.endDate).getUTCDate() + 1).forEach((day) => jobStatusPerDay[day] = key)
            })
        })

        const missingReportDates = stats.missingReportDates?.map((date) => new Date(date).getUTCDate()).sort((a, b) => a - b)

        let missingReportCounter = 0
        let monthDays = Range(1, lastDateOfMonth + 1).map((v) => {
            const reportMissing = missingReportDates ? missingReportDates[missingReportCounter] === v : false
            if (reportMissing) missingReportCounter++
            return {
                date: v,
                sx: {
                    background: '#FAF9F9'
                },
                dateSX: {
                    color: 'var(--joy-palette-primary-900)'
                },
                reportMissing: reportMissing,
                status: jobStatusPerDay[v]
            }
        })

        let postFillIns = Range(1, 42 - monthDays.size - antefillIns.size + 1).map((v) => {
            return {
                date: v,
                sx: {
                    background: 'var(--joy-palette-neutral-200)',
                    '&:hover': {
                        background: 'var(--joy-palette-neutral-500)'
                    }
                },
                onClick: () => {
                    updateCalendar(1)
                }
            }
        })

        setData([...antefillIns, ...monthDays, ...postFillIns])
    }, [calendar, updateCalendar, stats])

    return <Box sx={{...sx, display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none', WebkitUserSelect: 'none'}}>
        <CalendarControl sx={{my: 1, flex: '0 1 auto'}} calendarState={calendarState}/>
        <Box sx={{flex: '1 1 auto', display: 'grid', gridTemplateRows: '5% 1fr 1fr 1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', width: 1, height: 1}}>
            <Box sx={{gridRow: 1, gridColumnStart: 'span 7', display: 'grid', gridTemplateColumns: 'subgrid', width: 1, height: 1, background: 'var(--joy-palette-primary-700)', alignItems: 'center'}}>

                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) =>
                    <Typography key={index} className={RedHatFont.className} sx={
                        {
                            gridRow: 1,
                            gridColumn: index + 1,
                            textAlign: 'center',
                            fontWeight: 800,
                            color: 'white'
                        }
                    }>{day}</Typography>)}

            </Box>
            {Range(0, 6).map((i) => Range(0, 7).map((j) =>
                <Box key={i*10 + j} onClick={data[i*7 + j]?.onClick}
                     sx={{cursor: 'pointer', p: 1, gridRow: i+2, gridColumn: j+1, border: '1px solid black', '&:hover': {background: 'var(--joy-palette-neutral-100)'}, ...data[i*7 + j]?.sx}}>
                    <Stack spacing={1} direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                        <Typography level='title-lg' sx={{...data[i*7 + j]?.dateSX}}>{data[i*7 + j]?.date}</Typography>
                        <Stack spacing={1} direction='row' justifyContent='flex-end' alignItems='center' flexWrap='wrap'>
                            {data[i*7 + j]?.reportMissing && <Tooltip title='Missing report'><WarningAmberIcon sx={{color: '#FF9C24', fontSize: 28}} /></Tooltip>}
                            {data[i*7 + j]?.status && <Tooltip title={JOB_STATUS[data[i*7 + j]?.status]}><CircleIcon sx={{fontSize: 18, color: JOB_STATUS_COLORS[data[i*7 + j]?.status]}}></CircleIcon></Tooltip>}
                        </Stack>
                    </Stack>
                </Box>))}
        </Box>
    </Box>
}
