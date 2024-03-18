'use client'

import Box from "@mui/joy/Box";
import {DialogContent, Drawer, Select, Stack} from "@mui/joy";
import {useEffect, useState} from "react";
import Button from "@mui/joy/Button";
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ConstructionIcon from '@mui/icons-material/Construction';
import Image from "next/image";
import {config, postman} from "@/resources/config";
import JobPicker from "@/app/(app)/job_picker";
import {useRouter} from "next/navigation";
import Typography from "@mui/joy/Typography";
import * as PropTypes from "prop-types";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";


function NewJobForm() {
    const [projectManagers, setProjectManagers] = useState([])

    useEffect(() => {
        postman.get('/employee?' + new URLSearchParams({role: 'PM'}))
            .then(response => {
                if (response.status === 200) return response.data
                else return null
            }).then(pms => {

        })
    }, [setProjectManagers]);

    return <form>
        <Stack spacing={2} sx={{userSelect: "none"}}>
            <Typography textAlign="center" level="title-lg">Job Details</Typography>
            <FormControl>
                <FormLabel>Address</FormLabel>
                <Input required/>
            </FormControl>
            <FormControl>
                <FormLabel>Project Manager</FormLabel>
                <Select required>

                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Anticipated Start Date</FormLabel>
                <Input required type="date"/>
            </FormControl>
            <Button type="submit" color="primary" variant="soft">Create</Button>
        </Stack>
    </form>;
}

function QuickActions(props) {
    const [action, setAction] = useState('new_job')

    let actionComponent = <></>

    if (action === 'new_job') actionComponent = <NewJobForm />


    return <Drawer open={props.open} anchor={"left"} onClose={props.onClose}>
        <DialogContent
            sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 5, px: 2, mt: 20}}>
            <Typography variant="soft" level="h2" sx={{width: 1, py: 2, userSelect: 'none'}} textAlign="center">
                Quick Actions
            </Typography>
            <Button component="a" href="/report" variant="outlined" size="lg" sx={{width: 1, py: 2}}
                    endDecorator={<AssignmentIcon/>}>
                <Typography color="primary" level="h4">
                    Submit a new report
                </Typography>
            </Button>
            <Button variant="outlined" size="lg" sx={{width: 1, py: 2}} endDecorator={<ConstructionIcon/>}>
                <Typography color="primary" level="h4">
                    Create a new job
                </Typography>
            </Button>
            {Boolean(action) && <Box sx={{width: 1, border: '1px solid var(--joy-palette-neutral-600)', borderRadius: 8, p: 1}}>
                {actionComponent}
            </Box>}
        </DialogContent>
    </Drawer>;
}

QuickActions.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

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
