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
import {ButtonGroup, Modal, ModalDialog, Stack, Table} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import Button from "@mui/joy/Button";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Calendar({sx, calendarState, stats}) {
    let [job, _] = useContext(JobContext)
    const router = useRouter()
    const [calendar, updateCalendar] = calendarState
    const [data, setData] = useState([])
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(0)
    const [lastDateOfMonth, setLastDateOfMonth] = useState(0)
    const [activeReport, setActiveReport] = useState({})
    const [showReport, setShowReport] = useState(false)

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
            const reportDates = reports.map((report) => new Date(report.reportDate).getUTCDate()).sort((a, b) => a - b)

            const missingReportOnClick = (date) => {
                router.push('/report?' + new URLSearchParams({job: job.id, date: `${calendar.year.toString()}-${(calendar.month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`}))
            }

            const reportOnClick = (report) => {
                if (report == null) return;
                setActiveReport(report)
                setShowReport(true)
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

        postman.get('/reports?' + new URLSearchParams({job: job.id, startDate: formatDate(firstOfMonth), endDate: formatDate(today)}), {
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
        <Modal open={showReport} onClose={() => setShowReport(false)}>
            <ModalDialog>
                <ModalClose />
                <Box className='print' sx={{display: 'flex', flexDirection: 'column', overflowY: 'scroll'}}>
                    <Table color='neutral' className={`${RedHatFont.className}`} size='lg' variant='soft' sx={{width: 0.5, mx: 'auto', '--Table-headerUnderlineThickness': '15px'}} borderAxis='both'>
                        <thead>
                        <tr>
                            <th style={{border: '1px solid var(--joy-palette-neutral-100)'}} colSpan='2'>
                                <Typography className={RedHatFont.className} level='h1' textAlign='center'>{job.address}</Typography>
                                <Typography className={RedHatFont.className} level='h3' textAlign='center'>Job Report</Typography>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope='row'><Typography textAlign='right' fontWeight='700'>Report Date:</Typography>
                            </th>
                            <td><Typography fontWeight='500' textAlign='center'>{activeReport.reportDate}</Typography>
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'><Typography textAlign='right' fontWeight='700'>Submitted by:</Typography></th>
                            <td><Typography fontWeight='500' textAlign='center'>{activeReport.reportBy?.fullName}</Typography></td>
                        </tr>
                        <tr>
                            <th scope='row'><Typography textAlign='right' fontWeight='700'>Visitors:</Typography></th>
                            <td><Typography fontWeight='500' textAlign='center'>{activeReport.visitors ? activeReport.visitors : ''}</Typography></td>
                        </tr>
                        {activeReport.crew && <>
                            <tr>
                                <th scope='row' rowSpan={Object.keys(activeReport.crew).length + 1}><Typography
                                    textAlign='right' fontWeight='700'>Crew:</Typography></th>
                            </tr>
                                {Object.entries(activeReport.crew).map(([contractor, size], index) => <tr key={index} >
                                    <td style={{display: 'flex'}}>
                                        <Stack sx={{m: 'auto'}} direction='row' spacing={2}>
                                            <Typography fontWeight='700'>{contractor} </Typography>
                                            <Typography fontWeight='500'>{size}</Typography>
                                        </Stack>
                                    </td>
                                </tr>)}
                            </>
                        }
                        {activeReport.crew && Object.keys(activeReport.crew).length > 1 && <tr>
                            <th scope='row'><Typography textAlign='right' fontWeight='700'>Total Crew Size:</Typography>
                            </th>
                            <td><Typography fontWeight='700' textAlign='center'>{activeReport.crewSize}</Typography>
                            </td>
                        </tr>}
                        {activeReport.workDescriptions && <>
                        <tr>
                            <th scope='row' rowSpan={Object.keys(activeReport.workDescriptions).length + 1}><Typography textAlign='right' fontWeight='700'>Work Description:</Typography></th>
                        </tr>
                        {activeReport.workDescriptions.map((description, index) => <tr key={index}><td>
                            <Typography textAlign='center' fontWeight='500'>{description}</Typography>
                        </td></tr>)}
                        </>}
                        {activeReport.materials && <>
                            <tr>
                                <th scope='row' rowSpan={Object.keys(activeReport.materials).length + 1}><Typography textAlign='right' fontWeight='700'>Materials needed:</Typography></th>
                            </tr>
                            {activeReport.materials.map((material, index) => <tr key={index}><td>
                                <Typography textAlign='center' fontWeight='500'>{material}</Typography>
                            </td></tr>)}
                        </>
                        }
                        </tbody>
                    </Table>
                    <ButtonGroup variant='solid' buttonFlex={1} sx={{mx: 'auto', width: 0.5, my: 1}}>
                        <Button sx={{background: 'var(--joy-palette-warning-600)'}}>Modify</Button>
                        <Button sx={{background: 'var(--joy-palette-danger-500)'}}>Delete</Button>
                        <Button sx={{background: 'var(--joy-palette-success-500)'}} onClick={() => setShowReport(false)}>Close</Button>
                    </ButtonGroup>
                </Box>
            </ModalDialog>
        </Modal>
    </Box>
}
