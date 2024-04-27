import Box from "@mui/joy/Box";
import CalendarControl from "@/app/(app)/job/[id]/(calendar)/calendar_control";
import {Red_Hat_Display} from "next/font/google";
import {useContext, useEffect, useMemo, useState} from "react";
import Typography from "@mui/joy/Typography";
import {Range} from "immutable"
import CalendarDate from "@/app/(app)/job/[id]/(calendar)/calendar_date";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import {useRouter} from "next/navigation";
import ReportViewer from "@/app/(app)/job/[id]/(report)/report_viewer";
import {SnackbarContext} from "@/app/(app)/context";
import useMediaQuery from '@mui/material/useMediaQuery';

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})
const {DateTime} = require('luxon')
const isEmpty = require('lodash.isempty')

export default function Calendar({sx, calendarState, stats}) {
    const breakpointMd = useMediaQuery((theme) => theme.breakpoints.up('md'))

    const setSnackbar = useContext(SnackbarContext)
    const [job, _] = useContext(JobContext)

    const router = useRouter()
    const [calendar, updateCalendar] = calendarState
    const [data, setData] = useState([])
    const [showReportViewer, setShowReportViewer] = useState(false)

    const today = useMemo(() => DateTime.now(), [])
    const firstOfMonth = useMemo(() => DateTime.local(calendar.year, calendar.month + 1, 1), [calendar])
    const lastOfMonth = useMemo(() => DateTime.local(calendar.year, calendar.month + 1, 1).endOf('month'), [calendar])
    const firstDayOfMonth = useMemo(() => firstOfMonth.weekday % 7, [firstOfMonth])
    // noinspection JSAnnotator
    const lastOfPreviousMonth = useMemo(() => firstOfMonth.minus({days: 1}), [firstOfMonth])
    const lastDateOfMonth = useMemo(() => lastOfMonth.day, [lastOfMonth])

    const missingReportDates = useMemo(() => stats.missingReportDates?.map((date) => DateTime.fromISO(date).day).sort((a, b) => a - b), [stats])

    const jobStatusPerDay = useMemo(() => {
        const statuses = Array(lastDateOfMonth + 1)
        if (stats.statusHistory) Object.entries(stats.statusHistory).forEach(([key, value]) => {
            value.forEach((interval) => {
                let startDate = DateTime.fromISO(interval.startDate)
                let endDate = DateTime.fromISO(interval.endDate)

                if (startDate < firstOfMonth) startDate = firstOfMonth
                if (endDate > lastOfMonth)  endDate = lastOfMonth
                if (startDate > endDate) startDate = endDate

                Range(startDate.day, endDate.day + 1).forEach((day) => statuses[day] = key)
            })
        })
        return statuses
    }, [stats, firstOfMonth, lastOfMonth, lastDateOfMonth])

    useEffect(() => {
        const formatDate = (date) => date.toFormat('yyyy-MM-dd')

        if (job && !isEmpty(job) && today && firstOfMonth && lastOfMonth) {
            let endpoint = breakpointMd ? '/reports/summarized' : '/reports'
            postman.get(`${endpoint}?` + new URLSearchParams({
                job: job.id,
                startDate: formatDate(firstOfMonth),
                endDate: formatDate(lastOfMonth > today ? today : lastOfMonth)
            })).then((response) => {
                setData(response.data)
            }).catch((error) => {
                setSnackbar('error', {text: 'An error occurred while loading job data.'})
            })
        }
    }, [job, today, firstOfMonth, lastOfMonth, setSnackbar, breakpointMd])

    const reportDates = data.map((report) => DateTime.fromISO(report.date).day).sort((a, b) => a - b)

    const missingReportOnClick = (date) => {
        router.push('/report?' + new URLSearchParams({job: job.id, date: `${calendar.year.toString()}-${(calendar.month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`}))
    }

    const reportOnClick = (report) => {
        if (report) setShowReportViewer(report.date)
    }

    let missingReportCounter = 0
    let reportCounter = 0
    let monthDays = Range(1, lastDateOfMonth + 1).map((v) => {
        const report = reportDates[reportCounter] === v ? data[reportCounter++] : null
        const reportMissing = missingReportDates ? missingReportDates[missingReportCounter] === v : false
        if (reportMissing) missingReportCounter++
        const cursor = reportMissing || !!report ? {cursor: 'pointer'} : {}
        return {
            date: v,
            sx: {
                background: '#FAF9F9',
                ...cursor,
            },
            dateSX: {
                color: 'var(--joy-palette-primary-900)'
            },
            reportMissing: reportMissing,
            status: jobStatusPerDay[v],
            report: report,
            currentCalendarMonth: true,
            onClick: reportMissing && !report ? () => missingReportOnClick(v) : () => reportOnClick(report)
        }
    })

    const calendarGrid = () => {
        const lastDateOfPreviousMonth = lastOfPreviousMonth.day

        const createFillIns = (start, end, update) => {
            return Range(start, end + 1).map((v) => {
                return {
                    date: v,
                    sx: {
                        background: 'var(--joy-palette-neutral-200)',
                        '&:hover': {
                            background: 'var(--joy-palette-neutral-500)'
                        },
                        cursor: 'pointer'
                    },
                    currentCalendarMonth: false,
                    onClick: () => updateCalendar(update)
                }
            });
        }

        const anteFillIns = firstDayOfMonth > 0 ?
            createFillIns(lastDateOfPreviousMonth - firstDayOfMonth + 1, lastDateOfPreviousMonth, -1)
            : createFillIns(0, -1, -1);

        const postFillIns = createFillIns(1, 42 - monthDays.size - anteFillIns.size, 1);

        const preparedData = [...anteFillIns, ...monthDays, ...postFillIns]

        const findDateIndex = (date) => date.month - 1 === calendar.month && date.year === calendar.year ? date.day + firstDayOfMonth - 1 : null

        const todayIndex = findDateIndex(today)
        const startDateIndex = findDateIndex(DateTime.fromISO(job.startDate))

        return <Box sx={{flex: '1 1 auto', display: 'grid', gridTemplateRows: '5% 1fr 1fr 1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', width: 1, height: 1}}>
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
            {Range(0, 6).map((i) => Range(0, 7).map((j) => <CalendarDate key={`md-${i*10 + j}`} size='md' sx={{gridRow: i+2, gridColumn: j+1}} data={preparedData[i*7 + j]} metadata={{index: i*7 + j, todayIndex: todayIndex, startDateIndex: startDateIndex}} />))}
        </Box>
    }

    const calendarList = () => {
        const findDayOfWeek = (day) => (firstDayOfMonth + day - 1) % 7
        const findDateIndex = (date) => date.month - 1 === calendar.month && date.year === calendar.year ? date.day - 1 : null

        const todayIndex = findDateIndex(today)
        const startDateIndex = findDateIndex(DateTime.fromISO(job.startDate))

        return <Box sx={{width: 1, display: 'grid', gap: 2}}>
            {[...monthDays].slice(startDateIndex ? startDateIndex : 0).map((data, i) => <CalendarDate key={`sm-${i}`} size='sm' sx={{gridRow: i + 1, gridColumn: 1, height: 'fit-content'}} data={data} metadata={{index: i, todayIndex: todayIndex ? todayIndex - startDateIndex : null, startDateIndex: startDateIndex ? 0 : null, dayOfWeek: findDayOfWeek(data.date), calendar: calendar}} />)}
        </Box>
    }

    return <Box sx={{...sx, display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none', WebkitUserSelect: 'none', mb: 1}}>
        <CalendarControl sx={{my: 1, flex: '0 1 auto'}} calendarState={calendarState}/>
        {breakpointMd ? calendarGrid() : calendarList()}
        <ReportViewer open={!!showReportViewer} onClose={() => setShowReportViewer(false)} date={showReportViewer} />
    </Box>
}
