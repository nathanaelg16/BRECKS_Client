import {Stack} from "@mui/joy";
import ReportStats from "@/app/(app)/job/[id]/(sidebar)/(stats)/reports";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";

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

    return <Stack sx={{...sx, }} spacing={2}>
        <ReportStats loading={loading} job={job} ratioMissing={stats.missingReportDates?.length / 20.0} />
    </Stack>
}
