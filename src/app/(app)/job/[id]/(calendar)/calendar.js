import Box from "@mui/joy/Box";
import CalendarControl from "@/app/(app)/job/[id]/(calendar)/calendar_control";
import {Red_Hat_Display} from "next/font/google";
import {useEffect, useState} from "react";
import Typography from "@mui/joy/Typography";
import {Range} from "immutable"
import CalendarDate from "@/app/(app)/job/[id]/(calendar)/calendar_date";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Calendar({sx, calendarState, stats, job}) {
    const [calendar, updateCalendar] = calendarState
    const [data, setData] = useState([])
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(0)
    const [lastDateOfMonth, setLastDateOfMonth] = useState(0)

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
        setLastDateOfMonth(lastDateOfMonth)

        let today = new Date()
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())

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
                let startDate = new Date(interval.startDate)
                let endDate = new Date(interval.endDate)

                if (startDate < firstOfMonth) startDate = firstOfMonth
                if (endDate > today)  endDate = today
                if (startDate > endDate) startDate = endDate

                Range(startDate.getUTCDate(), endDate.getUTCDate() + 1).forEach((day) => jobStatusPerDay[day] = key)
            })
        })

        const viewingCurrentMonth = today >= firstOfMonth && today <= lastOfMonth
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
                status: jobStatusPerDay[v],
                today: viewingCurrentMonth && v === today.getUTCDate()
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
    }, [calendar, updateCalendar, stats, job])

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
            {Range(0, 6).map((i) => Range(0, 7).map((j) => <CalendarDate key={i*10 + j} sx={{gridRow: i+2, gridColumn: j+1}} data={data[i*7 + j]} metadata={{index: i*7 + j, firstDayOfMonth: firstDayOfMonth, lastDateOfMonth: lastDateOfMonth}} />))}
        </Box>
    </Box>
}
