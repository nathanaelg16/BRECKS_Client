'use client'

import Box from "@mui/joy/Box";
import {useCallback, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Sidebar from "@/app/(app)/job/[id]/(sidebar)/sidebar";
import Calendar from "@/app/(app)/job/[id]/(calendar)/calendar";

export default function Job({params}) {
    const [job, setJob] = useState({})
    const [calendar, setCalendar] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })
    const [stats, setStats] = useState({})

    const updateCalendar = (update) => {
        let newState = {}

        if (update === -1) {
            if (calendar.month === 0) {
                newState['year'] = calendar.year - 1
                newState['month'] = 11
            } else newState['month'] = calendar.month - 1
        } else if (update === 1) {
            if (calendar.month === 11) {
                newState['year'] = calendar.year + 1
                newState['month'] = 0
            } else newState['month'] = calendar.month + 1
        }

        setCalendar({...calendar, ...newState})
    }

    const updateJob = useCallback((token) => {
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
        })}, [params.id, setJob])

    useEffect(() => {
        updateJob(sessionStorage.getItem('token'))
    }, [params.id, updateJob])

    return <Box sx={{width: '100svw', gridTemplateColumns: '1fr 20svw', gap: '0svw', display: 'grid', height: '100%', border: '2px solid gray', borderTop: '1px solid gray'}}>
        <Calendar sx={{gridColumn: 1, gridRow: 1}} calendarState={[calendar, updateCalendar]} stats={stats} />
        <Sidebar sx={{gridColumn: 2, gridRow: 1}} job={job} calendar={calendar} statsState={[stats, setStats]} triggerUpdate={updateJob}/>
    </Box>
}
