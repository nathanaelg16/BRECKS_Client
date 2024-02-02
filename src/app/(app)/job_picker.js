import Typography from "@mui/joy/Typography";
import {Divider, Option, Select} from "@mui/joy";
import Box from "@mui/joy/Box";
import {useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {UserContext} from "@/app/(app)/user_context";

export default function JobPicker(props) {
    const [userJobs, setUserJobs] = useState([])
    const [allJobs, setAllJobs] = useState([])
    const user = useContext(UserContext);

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        postman.get('/jobs?' + new URLSearchParams({status: 'ACTIVE'}), {
            headers: {
                'Authorization': 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) setAllJobs(response.data)
            else console.log('hmmm')
        }).catch((error) => {
            console.log(error)
            //todo implement error handling
        })

        postman.get('/jobs?' + new URLSearchParams({status: 'ACTIVE', teamID: user.teamID}), {
            headers: {
                'Authorization': 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) setUserJobs(response.data)
            else console.log('hmmm')
        }).catch((error) => {
            console.log(error)
            //todo implement error handling
        })
    }, [user])

    const generateOptions = (jobs) => {
        return jobs.map((job) => <Option key={job.id} value={job.id}>{job.address}</Option>)
    }

    return <>
        <Box component="span" sx={{...props.sx}}>
            <Typography level={'title-md'}>
                Go to:
            </Typography>
            <Select sx={{marginRight: 1}} placeholder='Select a jobsite...'>
                <Divider>Your Jobs</Divider>
                {userJobs.length > 0 ? generateOptions(userJobs) : <Option disabled key={-1} value={-1}>No jobs available</Option>}
                <Divider>All Active</Divider>
                {allJobs.length > 0 ? generateOptions(allJobs) : <Option disabled key={-2} value={-1}>No jobs available</Option>}
            </Select>
        </Box>
    </>
}
