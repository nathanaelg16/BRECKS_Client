import {Badge, Card, CardActions, CardContent, Divider, Skeleton} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {Rubik} from "next/font/google";
import Button from "@mui/joy/Button";
import {useRouter} from "next/navigation";
import HomeViewStatusChanger from "@/app/(app)/home/status_change";
import Box from "@mui/joy/Box";

const rubik = Rubik({subsets: ['latin'], style: ['normal', 'italic']})

export default function JobCard({job}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [errorState, setErrorState] = useState(false)

    const [stats, setStats] = useState({
        totalManDays: -1,
        avgDailyManPower: -1,
        missingReportDates: []
    })

    useEffect(() => {
        postman.get(`/jobs/${job.id}/stats?` + new URLSearchParams({basis: 'week'}))
            .then((response) => {
                setStats(response.data)
                setErrorState(false)
            }).catch((error) => {
                setErrorState(true)
            }).finally(() => {
                setLoading(false)
        })
    }, [job.id])

    let badgeProps = {
        color: 'primary',
        badgeContent: 0,
    }

    return <>
        <Badge {...badgeProps} size='lg'>
            <Card onClick={() => router.push(`/job/${job.id}`)} color='primary' sx={{cursor: 'pointer', '&:hover': {background: 'var(--joy-palette-neutral-100)'}}}>
                <Typography level='h4' fontSize='md' textAlign='center'>{job.address}</Typography>
                <Typography sx={{mt: -1}} level='body-sm' textAlign='center'>{job.identifier && `(${job.identifier})`}</Typography>
                <CardContent>
                    <Divider className={rubik.className} sx={{my: 1, mb: 0}}>THIS WEEK</Divider>
                    {errorState ? <Box sx={{width: 1, height: 1, display: 'flex', my: 1, mb: 0}}>
                        <Typography level='body-sm' className={rubik.className} sx={{m: 'auto'}} textAlign='center' fontStyle='italic'>DATA NOT AVAILABLE</Typography>
                    </Box> : <>
                        <Typography level='body-sm' sx={{fontWeight: '600'}}><Skeleton loading={loading} animation='wave'>Total Man-days: <Typography sx={{fontWeight: '200'}}>{stats.totalManDays}</Typography></Skeleton></Typography>
                        <Typography level='body-sm' sx={{fontWeight: '600'}}><Skeleton loading={loading} animation='wave'>Avg Manpower: <Typography sx={{fontWeight: '200'}}>{+stats.avgDailyManPower.toFixed(2)}</Typography></Skeleton></Typography>
                        <Typography color={stats.missingReportDates.length > 0 ? 'primary' : ''} level='body-sm' sx={{fontWeight: '600'}}><Skeleton loading={loading} animation='wave'>Missing Reports: <Typography sx={{fontWeight: '200'}}>{stats.missingReportDates.length}</Typography></Skeleton></Typography>
                    </>}
                </CardContent>
                <CardActions>
                    <Button sx={{background: '#00A550', "&:hover": {background: '#00612F'}}} onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/report?job=${job.id}`)
                    }}>
                        Add Report
                    </Button>
                    <Button sx={{background: '#2072AF', "&:hover":{background: '#11466F'}}} onClick={(e) => {
                        e.stopPropagation()
                        setOpen(true)
                    }}>
                        Change Status
                    </Button>
                </CardActions>
            </Card>
        </Badge>
        <HomeViewStatusChanger openState={[open, setOpen]} job={job} />
    </>
}
