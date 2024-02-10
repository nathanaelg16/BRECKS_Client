import {Divider, Sheet, Stack} from "@mui/joy";
import ReportStats from "@/app/(app)/job/[id]/(sidebar)/(stats)/reports";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Typography from "@mui/joy/Typography";
import {MONTHS} from "@/app/utils";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function JobStats({sx, job, calendar}) {
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        postman.get(`/jobs/${job?.id}/stats?` + new URLSearchParams({basis: 'month', value: `${calendar.year.toString().padStart(2, '0')}-${(calendar.month + 1).toString().padStart(2, '0')}-01`}), {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setStats(response.data)
                setLoading(false)
            } else console.log('error')
        }).catch((error) => {
            console.log(error)
            // todo implement error handling
        }).finally(() => setLoading(false))
    }, [job.id, calendar])

    const dataRow = (key, value) => {
        return <Stack direction='row' spacing={2}>
            <Typography className={RedHatFont.className} fontWeight='800' sx={{color: 'var(--joy-palette-neutral-900)'}}>{key}:</Typography>
            <Typography className={RedHatFont.className} fontWeight='600' sx={{color: 'var(--joy-palette-neutral-900)'}}>{value}</Typography>
        </Stack>
    }

    return <>
        <Divider sx={{mt: 3, '--Divider-thickness': '2px', '--Divider-lineColor': 'black'}}><Typography level='title-lg' className={RedHatFont.className} sx={{color: 'black'}}>{`${MONTHS[calendar.month]} ${calendar.year}`}</Typography></Divider>
        <Stack sx={{...sx, }} spacing={2}>
            <ReportStats loading={loading} job={job} ratio={stats.missingReportDates?.length / 20.0} />
            <Sheet sx={{p: 1, borderRadius: '15px'}}>
                <Stack spacing={2}>
                    {dataRow('Total Man-days', stats.totalManDays)}
                    {dataRow('Average Daily Manpower', stats.avgDailyManPower)}
                </Stack>
            </Sheet>
        </Stack>
    </>
}
