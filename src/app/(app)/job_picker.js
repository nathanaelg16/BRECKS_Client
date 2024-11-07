import Typography from "@mui/joy/Typography";
import {Option, Select} from "@mui/joy";
import Box from "@mui/joy/Box";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {useRouter} from "next/navigation";
import {ClickAwayListener} from "@mui/base";

export default function JobPicker(props) {
    const router = useRouter()
    const [allJobs, setAllJobs] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        postman.get('/jobs?' + new URLSearchParams({status: 'ACTIVE'}))
            .then((response) => {
                setAllJobs([...response.data].sort())
            })
    }, [])

    const generateOptions = (jobs) => {
        return jobs.map((job) => <Option key={job.id} value={job.id}>{job.address}</Option>)
    }

    return <Box id='job-picker' className={`${props.className}`} component="span" sx={{...props.sx}}>
        <Typography id='job-picker-label' level={'title-md'}>
            Go to:
        </Typography>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Select listboxOpen={open} onListboxOpenChange={(isOpen) => setOpen(isOpen)} slotProps={{root: {id: 'job-picker-select'}}} value={''} sx={{marginRight: 1}} placeholder='Select a jobsite...' onChange={(ev, nv) => {
                if (nv !== null && nv !== '') router.push(`/jobs?id=${nv}`)
            }}>
                {allJobs.length > 0 ? generateOptions(allJobs) : <Option disabled key={-2} value={-1}>No jobs available</Option>}
            </Select>
        </ClickAwayListener>
    </Box>
}
