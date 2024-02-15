'use client'

import Box from "@mui/joy/Box";
import {useContext, useEffect, useState} from "react";
import Sidebar from "@/app/(app)/job/[id]/(sidebar)/sidebar";
import Calendar from "@/app/(app)/job/[id]/(calendar)/calendar";
import {JobContext} from "@/app/(app)/job/[id]/job_context";

export default function Job({params}) {
    let [_, updateJob] = useContext(JobContext)
    const [calendar, setCalendar] = useState((() => {
        const today = new Date()
        return {
            today: today,
            month: today.getMonth(),
            year: today.getFullYear()
        }
    })())
    const [stats, setStats] = useState({})

    const updateCalendar = (update) => {
        let newState = {}

        if (update === -1) {
            if (calendar.month === 0) {
                newState['year'] = calendar.year - 1
                newState['month'] = 11
            } else newState['month'] = calendar.month - 1
        } else if (update === 1) {
            if (calendar.today.getMonth() === calendar.month && calendar.today.getFullYear() === calendar.year) return;
            if (calendar.month === 11) {
                newState['year'] = calendar.year + 1
                newState['month'] = 0
            } else newState['month'] = calendar.month + 1
        }

        setCalendar({...calendar, ...newState})
    }

    useEffect(() => {
        updateJob(sessionStorage.getItem('token'))
    }, [params.id, updateJob])

    return <Box sx={{width: '100svw', gridTemplateColumns: '1fr 20svw', gap: '0svw', display: 'grid', height: '100%', border: '2px solid gray', borderTop: '1px solid gray'}}>
        <Calendar sx={{gridColumn: 1, gridRow: 1}} calendarState={[calendar, updateCalendar]} stats={stats} />
        <Sidebar sx={{gridColumn: 2, gridRow: 1}} calendar={calendar} statsState={[stats, setStats]} />
    </Box>
}
