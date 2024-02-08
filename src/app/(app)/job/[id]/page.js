'use client'

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Sidebar from "@/app/(app)/job/[id]/(sidebar)/sidebar";

export default function Job({params}) {
    const [job, setJob] = useState({})

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        postman.get(`/jobs/${params.id}`, {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) setJob(response.data)
            else {
                // todo error handling
            }
        }).catch((error) => {
            // todo implement error handling
        })
    }, [params.id])

    return <Box sx={{width: '100svw', gridTemplateColumns: '1fr 20svw', gap: '1svw', display: 'grid', height: '100%', border: '2px solid gray', borderTop: '1px solid gray'}}>
        <Box sx={{gridColumn: 1, gridRow: 1}}>
            <Typography>Side 1</Typography>
        </Box>
        <Sidebar sx={{gridColumn: 2, gridRow: 1}} job={job}/>
    </Box>
}
