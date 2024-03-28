import {Divider, Sheet, Stack} from "@mui/joy";
import ReportStats from "@/app/(app)/job/[id]/(sidebar)/(stats)/reports";
import {useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Typography from "@mui/joy/Typography";
import {MONTHS} from "@/app/utils";
import {Red_Hat_Display} from "next/font/google";
import {JobContext} from "@/app/(app)/job/[id]/job_context";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})
const isEmpty = require('lodash.isempty')

export default function JobStats({sx, calendar, statsState}) {
    let [job, _] = useContext(JobContext)
    const [stats, setStats] = statsState
    const [loading, setLoading] = useState(true)
    const [errorState, setErrorState] = useState(false)

    useEffect(() => {
        if (job && !isEmpty(job)) {
            postman.get(`/jobs/${job?.id}/stats?` + new URLSearchParams({
                basis: 'month',
                value: `${calendar.year.toString()}-${(calendar.month + 1).toString().padStart(2, '0')}-01`
            }))
                .then((response) => {
                    setStats(response.data)
                    setLoading(false)
                    setErrorState(false)
                }).catch((error) => {
                setErrorState(true)
            }).finally(() => setLoading(false))
        }
    }, [job, calendar, setStats])

    const dataRow = (key, value) => {
        return <Stack direction='row' spacing={2}>
            <Typography className={RedHatFont.className} fontWeight='800' sx={{color: 'var(--joy-palette-neutral-900)'}}>{key}:</Typography>
            <Typography className={RedHatFont.className} fontWeight='600' sx={{color: 'var(--joy-palette-neutral-900)'}}>{value}</Typography>
        </Stack>
    }

    return <>
        <Divider sx={{mt: 3, '--Divider-thickness': '2px', '--Divider-lineColor': 'black'}}><Typography level='title-lg' className={RedHatFont.className} sx={{color: 'black'}}>{`${MONTHS[calendar.month]} ${calendar.year}`}</Typography></Divider>
        <Stack sx={{...sx, }} spacing={2}>
            {errorState ? <>
                <Typography level='title-lg' className={RedHatFont.className}>Unable to load stats</Typography>
            </> : <>
                <ReportStats loading={loading} ratio={stats.missingReportDates?.length / 20.0} />
                <Sheet sx={{p: 1, borderRadius: '15px'}}>
                    <Stack spacing={2}>
                        {dataRow('Total Man-days', stats.totalManDays)}
                        {dataRow('Average Daily Manpower', stats.avgDailyManPower)}
                    </Stack>
                </Sheet>
            </>}
        </Stack>
    </>
}
