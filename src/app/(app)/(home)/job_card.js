import {Badge, Card, CardActions, CardContent, Divider, Modal, Tooltip} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {Rubik} from "next/font/google";
import {ErrorOutline} from "@mui/icons-material";
import Button from "@mui/joy/Button";
import {useRouter} from "next/navigation";

const rubik = Rubik({subsets: ['latin']})

export default function JobCard({job}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const [stats, setStats] = useState({
        totalManDays: -1,
        avgDailyManPower: -1,
        missingReportDates: []
    })

    const [badgeProps, setBadge] = useState({
        color: 'primary',
        badgeContent: 0,
    })

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        postman.get(`/jobs/${job.id}/stats?` + new URLSearchParams({basis: 'week'}), {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setStats(response.data)
            } else console.log('error')
        }).catch((error) => {
            console.log(error)
            // todo implement error handling
        })
    }, [job.id])

    useEffect(() => {
        if (stats.missingReportDates.length > 0) setBadge({
            color: 'warning',
            badgeContent: <Tooltip title='This job has missing reports.'>
                <ErrorOutline />
            </Tooltip>
        })
    }, [stats])

    return <>
        <Badge {...badgeProps} size='lg'>
            <Card color='primary'>
                <Typography level='h4' fontSize='md' textAlign='center'>{job.address}</Typography>
                <Typography sx={{mt: -1}} level='body-sm' textAlign='center'>{job.identifier && `(${job.identifier})`}</Typography>
                <CardContent>
                    <Divider className={rubik.className} sx={{my: 1, mb: 0}}>THIS WEEK</Divider>
                    <Typography level='body-sm' sx={{fontWeight: '600'}}>Total Man-days: <Typography sx={{fontWeight: '200'}}>{stats.totalManDays}</Typography></Typography>
                    <Typography level='body-sm' sx={{fontWeight: '600'}}>Avg Manpower: <Typography sx={{fontWeight: '200'}}>{stats.avgDailyManPower}</Typography></Typography>
                    <Typography color={stats.missingReportDates.length > 0 ? 'primary' : ''} level='body-sm' sx={{fontWeight: '600'}}>Missing Reports: <Typography sx={{fontWeight: '200'}}>{stats.missingReportDates.length}</Typography></Typography>
                </CardContent>
                <CardActions>
                    <Button sx={{background: '#00A550', "&:hover": {background: '#00612F'}}} onClick={() => router.push(`/report?job=${job.id}`)}>
                        Add Report
                    </Button>
                    <Button sx={{background: '#2072AF', "&:hover":{background: '#11466F'}}} onClick={() => setOpen(true)}>
                        Change Status
                    </Button>
                </CardActions>
            </Card>
        </Badge>
        <Modal open={open}>

        </Modal>
    </>
}
