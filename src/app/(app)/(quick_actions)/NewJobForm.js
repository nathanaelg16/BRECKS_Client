import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {postman} from "@/resources/config";
import {Option, Select, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {SnackbarContext} from "@/app/(app)/context";

export default function NewJobForm({onClose}) {
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const setSnackbar = useContext(SnackbarContext)
    const router = useRouter()

    useEffect(() => {
        postman.get('/teams')
            .then(response => {
                if (response.status === 200) setTeams(response.data)
                else throw new Error(`Response status code: ${response.status}`)
            }).catch(error => {
                setSnackbar('info', {text: 'Unable to load teams due to an error.'})
            })
    }, [setTeams, setSnackbar])

    return <>
        <form autoComplete="off" onSubmit={(event) => {
            event.preventDefault()
            setLoading(true)
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData).entries())
            postman.post('/jobs/new', formJson)
                .then(response => {
                    if (response.status === 200) {
                        setSnackbar('success', {text: 'Job created successfully!'})
                        router.push(`/job/${response.data}`)
                    } else throw new Error(`Response status code: ${response.status}`)
                }).catch(() => setSnackbar('error', {text: 'Job creation failed due to an error.'}))
                .finally(() => {
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
