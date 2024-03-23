import Typography from "@mui/joy/Typography";
import {Option, Select} from "@mui/joy";
import Box from "@mui/joy/Box";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {useRouter} from "next/navigation";

export default function JobPicker(props) {
    const router = useRouter()
    const [allJobs, setAllJobs] = useState([])

    useEffect(() => {
        postman.get('/jobs?' + new URLSearchParams({status: 'ACTIVE'}))
            .then((response) => {
                if (response.status === 200) setAllJobs([...response.data].sort())
                else console.log('hmmm')
            }).catch((error) => {
                console.log(error)
                //todo implement error handling
            })
    }, [])

    const generateOptions = (jobs) => {
        return jobs.map((job) => <Option key={job.id} value={job.id}>{job.address}</Option>)
    }

    return <>
        <Box component="span" sx={{...props.sx}}>
            <Typography level={'title-md'}>
                Go to:
            </Typography>
            <Select value={''} sx={{marginRight: 1}} placeholder='Select a jobsite...' onChange={(ev, nv) => {
                if (nv !== null && nv !== '') router.push(`/job/${nv}`)
            }}>
                {allJobs.length > 0 ? generateOptions(allJobs) : <Option disabled key={-2} value={-1}>No jobs available</Option>}
            </Select>
        </Box>
    </>
}
