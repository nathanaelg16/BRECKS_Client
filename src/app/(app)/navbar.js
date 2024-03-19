'use client'

import Box from "@mui/joy/Box";
import {DialogContent, Drawer, Option, Select, Snackbar, Stack} from "@mui/joy";
import {useEffect, useState} from "react";
import Button from "@mui/joy/Button";
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ConstructionIcon from '@mui/icons-material/Construction';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Image from "next/image";
import {config, postman} from "@/resources/config";
import JobPicker from "@/app/(app)/job_picker";
import {useRouter} from "next/navigation";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";


function NewJobForm({onClose}) {
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState('')
    const router = useRouter()

    useEffect(() => {
        postman.get('/teams')
            .then(response => {
                if (response.status === 200) setTeams(response.data)
                else throw new Error(`Response status code: ${response.status}`)
            })
    }, [setTeams]);

    let snackbarColor = 'neutral'
    let snackbarIcon = <InfoIcon />
    let snackbarText = snackbar

    if (snackbar === 'success') {
        snackbarColor = 'success'
        snackbarIcon = <CheckCircleIcon />
        snackbarText = 'Job created successfully!'
    } else if (snackbar === 'error') {
        snackbarColor = 'danger'
        snackbarIcon = <DangerousIcon />
        snackbarText = 'Job creation failed due to an error.'
    }

    return <>
        <Snackbar autoHideDuration={5000} variant='soft' color={snackbarColor} open={Boolean(snackbar)} onClose={() => setSnackbar('')} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} key='snackbar-bottom-left'>
            <Typography startDecorator={snackbarIcon} sx={{color: 'black'}} level='body-lg' fontWeight='500'>{snackbarText}</Typography>
        </Snackbar>
    <form autoComplete="off" onSubmit={(event) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries((formData).entries())
        postman.post('/jobs/new', formJson)
            .then(response => {
                if (response.status === 200) {
                    setSnackbar('success')
                    router.push(`/job/${response.data}`)
                } else throw new Error(`Response status code: ${response.status}`)
            }).catch((error) => {
                console.log(error)
                setSnackbar('error')
            }).finally(() => {
                setLoading(false)
                onClose()
            })
    }}>
        <Stack spacing={2} sx={{userSelect: "none"}}>
            <Typography textAlign="center" level="title-lg">Job Details</Typography>
            <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name='address' required placeholder='123 Main St'/>
            </FormControl>
            <FormControl>
                <FormLabel>Team</FormLabel>
                <Select name='teamID' required placeholder='Select a team...'>
                    {teams.map((team) => <Option key={team.id} value={team.id} label={team.projectManager.fullName}>
                        <Stack>
                            <Typography level='title-md' fontWeight='600'>{team.projectManager.fullName}</Typography>
                            <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={2} useFlexGap>
                                <Typography level='body-sm' fontWeight='600'>ACTIVE: <Typography fontWeight='400'>{team.numJobsActive}</Typography></Typography>
                                <Typography level='body-sm' fontWeight='600'>ON HOLD: <Typography fontWeight='400'>{team.numJobsOnHold}</Typography></Typography>
                                <Typography level='body-sm' fontWeight='600'>NOT STARTED: <Typography fontWeight='400'>{team.numJobsNotStarted}</Typography></Typography>
                            </Stack>
                        </Stack>
                    </Option>)}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Anticipated Start Date</FormLabel>
                <Input name='startDate' required type="date"/>
            </FormControl>
            <Button loading={loading} type="submit" color="primary" variant="soft">Create</Button>
        </Stack>
    </form>
    </>
}

function QuickActions(props) {
    const [action, setAction] = useState('')

    const onClose = () => {
        setAction('')
        props.onClose()
    }

    let actionComponent = <></>

    if (action === 'new_job') actionComponent = <NewJobForm onClose={onClose} />

    return <Drawer open={props.open} anchor={"left"} onClose={onClose}>
        <DialogContent
            sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 5, px: 2, mt: 10}}>
            <Typography variant="soft" level="h2" sx={{width: 1, py: 2, userSelect: 'none'}} textAlign="center">
                Quick Actions
            </Typography>
            <Button component="a" href="/report" variant="outlined" size="lg" sx={{width: 1, py: 2}}
                    endDecorator={<AssignmentIcon/>}>
                <Typography color="primary" level="h4">
                    Submit a new report
                </Typography>
            </Button>
            <Button onClick={() => setAction('new_job')} variant="outlined" size="lg" sx={{width: 1, py: 2}} endDecorator={<ConstructionIcon/>}>
                <Typography color="primary" level="h4">
                    Create a new job
                </Typography>
            </Button>
            {Boolean(action) && <Box sx={{width: 1, border: '1px solid var(--joy-palette-neutral-600)', borderRadius: 8, p: 1}}>
                {actionComponent}
            </Box>}
        </DialogContent>
    </Drawer>
}

export default function Navbar() {
    const [isDrawerOpen, setDrawerOpen] = useState(false)
    const router = useRouter()

    return <>
        <QuickActions open={isDrawerOpen} onClose={() => setDrawerOpen(false)}/>
        <Box component='header' sx={{
            borderBottom: '1px solid gray',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100svw',
            flex: '0 1 auto'
        }}>
            <Box component='span' sx={{width: '33vw'}}>
                <Button size='md' onClick={() => setDrawerOpen(true)} variant='outline'>
                    <MenuIcon/>
                </Button>
            </Box>
            <Box component="span" sx={{width: '33vw', display: 'flex', cursor: 'pointer'}}
                 onClick={() => router.push('/home')}>
                <Image src={config.spaces.concat("/logos/BRECKS-v2@2x.png")}
                       alt="BRECKS"
                       width="177"
                       height="59"
                       style={{margin: 'auto'}}
                />
            </Box>
            <Box sx={{width: '33vw', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3}}>
                <JobPicker sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1}}/>
            </Box>
        </Box>
    </>
}
