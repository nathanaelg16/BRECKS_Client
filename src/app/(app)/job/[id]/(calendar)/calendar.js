import Box from "@mui/joy/Box";
import CalendarControl from "@/app/(app)/job/[id]/(calendar)/calendar_control";
import {Red_Hat_Display} from "next/font/google";
import {useContext, useEffect, useState} from "react";
import Typography from "@mui/joy/Typography";
import {Range} from "immutable"
import CalendarDate from "@/app/(app)/job/[id]/(calendar)/calendar_date";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import {useRouter} from "next/navigation";
import ReportViewer from "@/app/(app)/job/[id]/(report)/report_viewer";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Calendar({sx, calendarState, stats}) {
    let [job, _] = useContext(JobContext)
    const router = useRouter()
    const [calendar, updateCalendar] = calendarState
    const [data, setData] = useState([])
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(0)
    const [lastDateOfMonth, setLastDateOfMonth] = useState(0)
    const [showReportViewer, setShowReportViewer] = useState(false)

    useEffect(() => {
        const firstOfMonth = new Date(calendar.year, calendar.month, 1)

        const lastOfMonth = new Date(calendar.year, calendar.month + 1, 1)
        lastOfMonth.setDate(0)

        let today = new Date()
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        const prepareData = (reports) => {
            const firstDayOfMonth = firstOfMonth.getUTCDay()
            setFirstDayOfMonth(firstDayOfMonth)

            const lastOfPreviousMonth = new Date(firstOfMonth.getTime())
            lastOfPreviousMonth.setDate(0)

            const lastDateOfPreviousMonth = lastOfPreviousMonth.getUTCDate()

            const lastDateOfMonth = lastOfMonth.getUTCDate()
            setLastDateOfMonth(lastDateOfMonth)

            const jobStatusPerDay = Array(lastDateOfMonth + 1)
            if (stats.statusHistory) Object.entries(stats.statusHistory).forEach(([key, value]) => {
                value.forEach((interval) => {
                    let startDate = new Date(interval.startDate)
                    let endDate = new Date(interval.endDate)

                    if (startDate < firstOfMonth) startDate = firstOfMonth
                    if (endDate > today)  endDate = lastOfMonth
                    if (startDate > endDate) startDate = endDate

                    Range(startDate.getUTCDate(), endDate.getUTCDate() + 1).forEach((day) => jobStatusPerDay[day] = key)
                })
            })

            const missingReportDates = stats.missingReportDates?.map((date) => new Date(date).getUTCDate()).sort((a, b) => a - b)
            const reportDates = reports.map((report) => new Date(report.date).getUTCDate()).sort((a, b) => a - b)

            const missingReportOnClick = (date) => {
                router.push('/report?' + new URLSearchParams({job: job.id, date: `${calendar.year.toString()}-${(calendar.month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`}))
            }

            const reportOnClick = (report) => {
                if (report) setShowReportViewer(report.date)
            }

            let missingReportCounter = 0
            let reportCounter = 0
            let monthDays = Range(1, lastDateOfMonth + 1).map((v) => {
                const report = reportDates[reportCounter] === v ? reports[reportCounter++] : null
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
                    today: today.getUTCMonth() === calendar.month && today.getUTCFullYear() === calendar.year && v === today.getUTCDate(),
                    report: report,
                    currentCalendarMonth: true,
                    onClick: reportMissing && !report ? () => missingReportOnClick(v) : () => reportOnClick(report)
                }
            })

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
                : createFillIns(0, 0, -1);

            const postFillIns = createFillIns(1, 42 - monthDays.size - anteFillIns.size, 1);

            return [...anteFillIns, ...monthDays, ...postFillIns]
        }

        const formatDate = (date) => {
            return date.toLocaleString("en-CA", {timeZone: "UTC", month: '2-digit', day: '2-digit', year: 'numeric'})
        }

        const token = sessionStorage.getItem('token')

        postman.get('/reports/summarized?' + new URLSearchParams({job: job.id, startDate: formatDate(firstOfMonth), endDate: formatDate(lastOfMonth > today ? today : lastOfMonth)}), {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setData(prepareData(response.data))
            } else {
                console.log(response)
                // todo implement error handling
            }
        }).catch((error) => {
            console.log(error)
            // todo implement error handling
        })

    }, [calendar, updateCalendar, stats, job, router])

    const today = new Date()
    const todayIndex = today.getMonth() === calendar.month ? today.getDate() + firstDayOfMonth - 1 : null

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
            {Range(0, 6).map((i) => Range(0, 7).map((j) => <CalendarDate key={i*10 + j} sx={{gridRow: i+2, gridColumn: j+1}} data={data[i*7 + j]} metadata={{index: i*7 + j, firstDayOfMonth: firstDayOfMonth, lastDateOfMonth: lastDateOfMonth, todayIndex: todayIndex}} />))}
        </Box>
        <ReportViewer anchor='right' open={!!showReportViewer} onClose={() => setShowReportViewer(false)} date={showReportViewer} />
    </Box>
}
